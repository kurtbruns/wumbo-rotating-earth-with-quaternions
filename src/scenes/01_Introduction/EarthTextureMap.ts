import Delaunator from "delaunator";
import { CoordinateSystem, Quaternion, Vector3 } from "../../vector/src";
import { extractPolygons, positionToVector3, Topology } from "../GeoJSONWrapper";



export class EarthTextureMap extends CoordinateSystem {

    constructor() {
        let width = 1024;
        let height = width/2;
        super({
            width: width,
            height: height,
            gridHeight: 180,
            gridWidth: 360,
            internalX: -180,
            internalY: -90,
            drawGrid: false,
            background: true,
            player: true
            
        })



        let background = this.frame.rectangle(0, 0, width, height)
        .setAttribute('fill', 'var(--earth-blue)');



        this.frame.background.prependChild(background);


        window.onload = () =>{
            fetch('./land-110m.json')
            .then(response => response.json())
            .then((topology: Topology) => {
                this.triangleMeshFlat(topology)
            })
            .catch(error => {
                console.error('Error fetching the TopoJSON file:', error);
            });
        }


    }

    isPointInPolygon(point: [number, number], polygon: Array<[number, number]>): boolean {
        let inside = false;
        const [px, py] = point;

        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const [xi, yi] = polygon[i];
            const [xj, yj] = polygon[j];

            // Check if point is on the boundary of the polygon
            const onBoundary =
                (yi === py && yj === py && (xi <= px && px <= xj || xj <= px && px <= xi)) || // Horizontal edge case
                (py === yi && py === yj && px === xi); // Point is exactly on a vertex
            if (onBoundary) {
                return true;
            }

            // Ray-casting logic
            const intersect = ((yi > py) !== (yj > py)) &&
                (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    }

    splitPolygonByAntimeridian(polygon: [number, number][]): [number, number][][] {

        let currentPolygon: [number, number][] = [];
        const polygons: [number, number][][] = [
            currentPolygon
        ];

        let previousPoint: [number, number] = null;

        let left = 0;
        let right = 0;
        for (let i = 0; i < polygon.length; i++) {
            const currentPoint = polygon[i];
            if (previousPoint) {
                const [x1, y1] = previousPoint;
                const [x2, y2] = currentPoint;

                if (x2 - x1 >= 180) {

                    currentPolygon.push([-180, (y1 + y1) / 2])
                    currentPolygon = [
                        [180, (y1 + y1) / 2]
                    ];
                    polygons.push(currentPolygon)

                    left++;
                } else if (x2 - x1 <= -180) {

                    currentPolygon.push([180, (y1 + y1) / 2])
                    currentPolygon = [
                        [-180, (y1 + y1) / 2]
                    ];
                    polygons.push(currentPolygon)

                    right++;
                }

                currentPolygon.push(currentPoint)

            } else {
                currentPolygon.push(currentPoint)
            }

            previousPoint = currentPoint;
        }

        if (left === right) {
            polygons[0] = [...polygons[0], ...polygons.pop()]
        }

        return polygons;
    }


    triangleMeshFlat(topology: Topology, opacity = 0.5) {
        const allTriangles = {};
    
        for (const [objectKey, geometryCollection] of Object.entries(topology.objects)) {
            const temp = extractPolygons({
                type: 'Topology',
                objects: { [objectKey]: geometryCollection },
                arcs: topology.arcs,
                transform: topology.transform
            });
    
            let polygons = temp;
    
            polygons.forEach(polygon => {
    
                // Store all points for triangulation within this polygon
                let points = [];
                let rings = [];
    
                let first = true;
                polygon.forEach(ring => {
    
                    // ignore the first ring
                    if (!first) {
                        rings.push([]);
                    }
    
                    ring.forEach(position => {
                        points.push(position);
                        if (!first) {
                            rings[rings.length - 1].push(position);
                        }
                    });
    
                    first = false;
                });
    
                let needsNormalization = false;
    
                let split = this.splitPolygonByAntimeridian(points);
    
                // Determine if the polygon spans the International Date Line
                for (let i = 0; i < points.length - 1; i++) {
                    const [x1, y1] = points[i];
                    const [x2, y2] = points[i + 1];
    
                    if (Math.abs(x2 - x1) > 180) {
                        needsNormalization = true;
                        break;
                    }
                }
    
                let pointsWithExtra = Array.from(points);
    
                const nPoints = 4000; // total number of points to generate
    
                for (let i = 0; i < nPoints; i++) {
                    const x = (Math.random() * 360) - 180; // Random longitude between -180 and 180
                    const y = (Math.random() * 180) - 90;  // Random latitude between -90 and 90
    
                    let coordinate : [number, number] = [x, y];
    
                    if (needsNormalization) {
                        let inRing = false;
                        for (const ring of rings) {
                            if (this.isPointInPolygon(coordinate, ring)) {
                                inRing = true;
                                break;
                            }
                        }
    
                        if (!inRing) {
                            for (const polygon of split) {
                                if (this.isPointInPolygon(coordinate, polygon)) {
                                    pointsWithExtra.push(coordinate);
                                    break;
                                }
                            }
                        }
    
                    } else if (this.isPointInPolygon(coordinate, points)) {
                        pointsWithExtra.push(coordinate);
                    }
                }
    
                // Perform the triangulation
                let delaunay = Delaunator.from(pointsWithExtra);
    
                // Extract triangles and construct the mesh
                const delaunayTriangles = delaunay.triangles;
    
                const mesh = [];
    
                for (let i = 0; i < delaunayTriangles.length; i += 3) {
                    const a = pointsWithExtra[delaunayTriangles[i]];
                    const b = pointsWithExtra[delaunayTriangles[i + 1]];
                    const c = pointsWithExtra[delaunayTriangles[i + 2]];
    
                    const centroid : [number, number ]= [
                        (a[0] + b[0] + c[0]) / 3,
                        (a[1] + b[1] + c[1]) / 3
                    ];
    
                    if (needsNormalization) {
                        let inRing = false;
                        for (const ring of rings) {
                            if (this.isPointInPolygon(centroid, ring)) {
                                inRing = true;
                                break;
                            }
                        }
    
                        if (!inRing) {
                            for (const polygon of split) {
                                if (this.isPointInPolygon(centroid, polygon)) {
                                    mesh.push({ a, b, c });
                                    break;
                                }
                            }
                        }
    
                    } else if (this.isPointInPolygon(centroid, points)) {
                        mesh.push({ a, b, c });
                    }
    
                }
    
                // Define a vertex array and a triangle array
                let vertices = [];
                let triangles = [];
    
                // Helper function to add a vertex and return its index
                function addVertex(x, y) {
                    const vector = [x, y];
                    const index = vertices.findIndex(v => v[0] === vector[0] && v[1] === vector[1]);
                    if (index !== -1) {
                        return index; // If it exists, return the existing index
                    } else {
                        vertices.push(vector); // Otherwise, add it and return the new index
                        return vertices.length - 1;
                    }
                }
    
                // Iterate through the mesh to populate vertices and triangles
                mesh.forEach(triangle => {
                    const aIndex = addVertex(triangle.a[0], triangle.a[1]);
                    const bIndex = addVertex(triangle.b[0], triangle.b[1]);
                    const cIndex = addVertex(triangle.c[0], triangle.c[1]);
    
                    triangles.push({
                        a: aIndex,
                        b: bIndex,
                        c: cIndex,
                    });
                });
    
                // Create a new SVG path for this polygon
                let path = this.frame.path();
                path.setAttribute('fill', 'var(--earth-green)');
                path.setAttribute('fill-opacity', opacity.toFixed(2));
                path.setAttribute('stroke-width', '1px');
                path.setAttribute('stroke-opacity', '0.5');
                path.update = () => {
                    let d = '';
    
                    // Precompute the projected vertices and their SVG positions
                    const projectedPoints = {};
    
                    triangles.forEach(triangle => {
                        const { a, b, c } = triangle;
    
                        let tp = '';
                        let hasStarted = false;
    
                        [a, b, c].forEach(vertexIndex => {
                            let r;
    
                            if (projectedPoints[vertexIndex]) {
                                r = projectedPoints[vertexIndex];
                            } else {
                                const vertex = vertices[vertexIndex];
                                r = this.plot.SVGToRelative({
                                    x: vertex[0],
                                    y: vertex[1],
                                });
                                projectedPoints[vertexIndex] = r;
                            }
    
                            tp += `${hasStarted ? 'L' : 'M'} ${r.x.toFixed(2)} ${r.y.toFixed(2)} `;
                            hasStarted = true;
                        });
    
                        d += tp + 'Z ';
                    });
    
                    // Set the path data string
                    path.d = d;
                };
                path.update();
            });
        }
    
        return allTriangles;
    }


}