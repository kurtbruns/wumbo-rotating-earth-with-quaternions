import { Group, interpolateColor, Path, Quaternion, Theme, Value, Vector3 } from "../vector/src";
import { SphereScene } from "./SphereScene";
import { Topology, extractPolygons, positionToVector3 } from './GeoJSONWrapper';
import Delaunator from "delaunator";
import { Position } from "geojson";

interface EarthConfig {
    q?: Quaternion;
    cameraPosition?: Vector3;
    cameraOrientation?: Quaternion;
    drawAxes?: boolean;
    labelAxes?: boolean;
    size?: number;
    drawIJK?: boolean;
    drawSphereCircles?: boolean;
    showQuaternionTex?: boolean;
    drawTriangleMesh?: boolean;
    drawContinentsOutline?: boolean;
}

export class EarthScene extends SphereScene {

    rotateCamera: boolean;
    continentsOutline: Path;
    triangleMeshGroup: Group;
    continentsOutlineGroup: Group;
    onLoad: () => void;

    constructor(config: EarthConfig = {}) {
        let defaultConfig: EarthConfig = {
            cameraOrientation: new Quaternion(1, 0, 0, 0),
            cameraPosition: new Vector3(0, 0, -5),
            q: new Quaternion(1, 0, 0, 0),
            drawAxes: false,
            labelAxes: false,
            size: 1.5,
            drawIJK: true,
            showQuaternionTex: true,
            drawSphereCircles: false,
            drawTriangleMesh: false,
            drawContinentsOutline: false,
        };

        config = { ...defaultConfig, ...config };

        super({
            drawAxes: config.drawAxes,
            cameraOrientation: config.cameraOrientation,
            cameraPosition: config.cameraPosition,
            drawSphere: false,
            drawSphereCircles: config.drawSphereCircles,
            drawIJK: config.drawIJK,
            showQuaternionTex: config.showQuaternionTex,
            size: config.size,
        });

        let theme = Theme.getInstance();
        theme.setVariable('earth-blue', '#D5E5FF', 'light')
        theme.setVariable('earth-blue', '#094E8F', 'dark') // alt
        theme.setVariable('earth-blue', '#08345E', 'dark')
        theme.setVariable('earth-green', '#53A674', 'light') // 0.8 opacity


        // theme.setVariable('earth-green', '#53A674', 'dark') // 0.8 opacity
        // theme.setVariable('earth-green', '#52D888', 'dark') // 0.5 opacity
        theme.setVariable('earth-green', '#88EC6F', 'dark') // 0.33 opacity

        this.rotateCamera = false;

        let sphere = this.drawSphere(new Value(1), 0.15, true, 'var(--earth-blue)')

        this.background.prependChild(sphere);

        this.onLoad = () => { };

        // this.drawAntiMeridian(1)

        // fetch('./land-50m.json')
        fetch('./land-110m.json')
            .then(response => response.json())
            .then((topology: Topology) => {
                if (config.drawTriangleMesh) {
                    this.triangleMesh(topology, theme.getMode() === 'dark' ? 0.4 : 0.5);
                } 
                
                if (config.drawContinentsOutline) {
                    this.drawContinents(topology)
                }
                
                this.onLoad();
            })
            .catch(error => {
                console.error('Error fetching the TopoJSON file:', error);
            });

    }


    drawAntiMeridian(r: number = 1, opacity: number = 0.2,): void {

        let group = this.background.group();
        let lineGroup = group.group();

        let s = 144;
        let verticalN = 2;
        let horizontalN = 12;
        let identity = Quaternion.identity();

        let longs = this.generateVerticalSlices(s, verticalN, identity, 1).slice(1, 2);

        for (let i = 0; i < longs.length; i++) {
            let path = lineGroup.path();
            path.setAttribute('stroke', 'var(--red)');
            path.setAttribute('stroke-width', '1.5px');
            path.setAttribute('stroke-opacity', `${opacity}`)
            path.addDependency(this.camera, this.camera.position, this.camera.orientation, this.q);
            path.update = () => {

                let lastVisible = false;
                let d = '';
                for (let j = 0; j < longs[i].length; j++) {

                    let point = longs[i][j].copy();
                    let t = point.apply(this.q);

                    // Flip the z-coordinate to be a right-handed system when caclulatig the distance
                    let u = new Vector3(t.x, t.y, -t.z);
                    let distance = this.camera.position.dot(u);

                    if (distance > 1) {
                        let v = this.camera.projectPoint(t);
                        let u = this.viewPort.plot.SVGToRelative(v);

                        if (lastVisible) {
                            d += `L ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                        } else {
                            d += `M ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                            lastVisible = true;
                        }
                    } else {
                        lastVisible = false;
                    }
                }

                path.d = d;
            }
            path.update();
        }


    }

    limit(polygons) {
        // 34 Asia
        // 108 problem
        // 117 antartica
        let flag = false;
        if (flag) {
            let x = 117
            let range = 1;
            let start = polygons.length - x - range;
            let end = polygons.length - x;
            return polygons.slice(start, end)
        } else {
            return polygons;
        }

    }

    polygonContains(point: [number, number], polygon: [number, number][]) {
        const [x, y] = point;
        let n = polygon.length,
            p = polygon[n - 1],
            [x0, y0] = p,
            inside = false;

        for (let i = 0; i < n; ++i) {
            p = polygon[i];
            const [x1, y1] = p;
            if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) {
                inside = !inside;
            }
            [x0, y0] = [x1, y1];
        }

        return inside;
    }

    // splitPolygonByAntimeridian(polygon: [number, number][]): [[number, number][], [number, number][]] {
    //     const firstPolygon: [number, number][] = [];
    //     const secondPolygon: [number, number][] = [];

    //     let previousPoint: [number, number] | null = null;

    //     let hasStarted = false;
    //     let prevIndex = 0;
    //     let firstNormalization = 0;
    //     let secondNormalization = 0;
    //     for (let i = 0; i < polygon.length; i++) {
    //         const currentPoint = polygon[i];
    //         if (previousPoint) {
    //             const [x1, y1] = previousPoint;
    //             const [x2, y2] = currentPoint;

    //             if (x2 - x1 >= 180) {
    //                 // console.log('here', formatPolygons([secondPolygon]), prevIndex)
    //                 firstNormalization = -360;
    //                 let temp = null;
    //                 for (let j = i - 1; j >= prevIndex; j--) {
    //                     secondPolygon[j][0] += 360;
    //                     temp = j;
    //                 }
    //                 prevIndex = temp;

    //                 firstPolygon[firstPolygon.length - 2] = [x2 + firstNormalization, y2];
    //                 secondPolygon[secondPolygon.length - 2] = [x2 + secondNormalization, y2];
    //                 // secondNormalization = 360;


    //             } else if (x2 - x1 <= -180) {
    //                 firstNormalization = 0;
    //                 secondNormalization = 360;
    //                 // console.log('here', formatPolygons([secondPolygon]), prevIndex)
    //             }
    //             firstPolygon.push([x2 + firstNormalization, y2])
    //             secondPolygon.push([(x2 + secondNormalization), y2])

    //         } else {
    //             firstPolygon.push([...currentPoint])
    //             secondPolygon.push([...currentPoint])
    //         }


    //         previousPoint = currentPoint;
    //     }


    //     return [firstPolygon, secondPolygon];
    // }

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


    isPointInPolarPolygon(point, polygon) {
        const [lonP, latP] = point;
    
        // Create an array to store the max latitude for each longitude angle (0 to 360 degrees)
        let maxLatitudes = new Array(360).fill(-Infinity); // Initialize all to -Infinity
    
        // Normalize longitude to the range [0, 360)
        const normalizeLongitude = (lon) => (lon < 0 ? lon + 360 : lon % 360);
    
        // Preprocess the polygon to find max latitudes for all angles (longitudes)
        for (let i = 0; i < polygon.length; i++) {
            const [lon1, lat1] = polygon[i];
            const [lon2, lat2] = polygon[(i + 1) % polygon.length]; // Next vertex (wrap around)
    
            // Normalize the longitudes
            let angle1 = normalizeLongitude(lon1);
            let angle2 = normalizeLongitude(lon2);
    
            // Interpolate latitudes between angle1 and angle2
            if (angle1 > angle2) {
                // Handle case where the polygon crosses the 360° boundary
                [angle1, angle2] = [angle2, angle1];
            }
    
            for (let angle = Math.floor(angle1); angle <= Math.floor(angle2); angle++) {
                let t = (angle - angle1) / (angle2 - angle1); // Interpolation factor
                let interpolatedLat = lat1 + t * (lat2 - lat1); // Linear interpolation
                if (interpolatedLat > maxLatitudes[angle]) {
                    maxLatitudes[angle] = interpolatedLat; // Update max latitude for this angle
                }
            }
        }
    
        // Normalize the point's longitude to 0-359 degrees
        let angleP = normalizeLongitude(lonP);
    
        // Check if the point's latitude is less than or equal to the max latitude for this angle
        return latP <= maxLatitudes[Math.floor(angleP)];
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

    drawAntartica(polygon: Position[][], opacity = 0.5) {

        // Store all points for triangulation within this polygon
        let points = [];
        polygon.forEach(ring => {

            ring.forEach(position => {
                points.push(position);
            });

        });

        let pointsWithExtra = Array.from(points);
        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        const goldenAngle = 2 * Math.PI * (1 - 1 / goldenRatio);
        const nPoints = 4000; // total number of points to generate

        for (let i = 0; i < nPoints; i++) {
            const theta = goldenAngle * i;
            const z = 1 - 2 * (i + 0.5) / nPoints;
            const radius = Math.sqrt(1 - z * z);

            const x = Math.cos(theta) * radius;
            const y = Math.sin(theta) * radius;

            const longitude = Math.atan2(y, x) * (180 / Math.PI);
            const latitude = Math.asin(z) * (180 / Math.PI);

            let coordinate: [number, number] = [longitude, latitude];

        if (this.isPointInPolarPolygon(coordinate, points)) {
                pointsWithExtra.push(coordinate);
            }
        }

        // Perform the triangulation
        let delaunay = Delaunator.from(pointsWithExtra);

        // Extract triangles and construct the mesh
        const delaunayTriangles: Uint32Array = delaunay.triangles;

        const mesh: Array<{ a: [number, number], b: [number, number], c: [number, number] }> = [];

        for (let i = 0; i < delaunayTriangles.length; i += 3) {
            const a = pointsWithExtra[delaunayTriangles[i]];
            const b = pointsWithExtra[delaunayTriangles[i + 1]];
            const c = pointsWithExtra[delaunayTriangles[i + 2]];

            const centroid: [number, number] = [
                (a[0] + b[0] + c[0]) / 3,
                (a[1] + b[1] + c[1]) / 3
            ];

            if (this.isPointInPolarPolygon(centroid, points)) {
                mesh.push({ a, b, c });
            }

        }

        // Define a vertex array and a triangle array
        let vertices: Vector3[] = [];
        let triangles: { a: number, b: number, c: number }[] = [];

        // Helper function to add a vertex and return its index
        function addVertex(x: number, y: number): number {
            const vector = positionToVector3(x, y);
            const index = vertices.findIndex(v => v.equals(vector)); // Check if the vertex already exists
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
        let path = this.background.path();
        path.setAttribute('fill', 'var(--earth-green)');
        path.setAttribute('fill-opacity', opacity.toFixed(2));
        path.setAttribute('stroke-width', '1px');
        path.setAttribute('stroke-opacity', '0.5');
        path.addDependency(this.q, this.camera);
        path.update = () => {
            let d = '';
            let inverse = this.q.inverse();

            // Precompute the transformed vertices and their projections
            const transformedVertices: { [index: number]: Vector3 } = {};
            const projectedPoints: { [index: number]: { x: number, y: number } } = {};

            triangles.forEach(triangle => {
                const { a, b, c } = triangle;

                let tp = '';
                let hasStarted = false;
                let flag = false;

                [a, b, c].forEach(vertexIndex => {
                    let t: Vector3;
                    let r: { x: number, y: number };

                    if (transformedVertices[vertexIndex]) {
                        // If the vertex has already been transformed, use the cached result
                        t = transformedVertices[vertexIndex];
                        r = projectedPoints[vertexIndex];
                    } else {
                        // Convert the vertex to a quaternion for rotation
                        let vertex = vertices[vertexIndex];
                        let vectorQuaternion = new Quaternion(0, vertex.x, vertex.y, vertex.z);

                        // Perform the rotation: q * v * q^(-1)
                        let rotatedQuaternion = this.q.multiply(vectorQuaternion).multiply(inverse);

                        // Convert the rotated quaternion back to a Vector3
                        t = rotatedQuaternion.toVector3();

                        // Cache the transformed vertex
                        transformedVertices[vertexIndex] = t;

                        // Project the point and convert to relative SVG coordinates
                        let p = this.camera.projectPoint(t);
                        r = this.viewPort.plot.SVGToRelative(p);

                        // Cache the projected point
                        projectedPoints[vertexIndex] = r;
                    }

                    // Create a new vector u and calculate distance
                    let u = new Vector3(t.x, t.y, -t.z);
                    let distance = this.camera.position.dot(u);

                    if (distance >= 1) {
                        flag = true;
                    }

                    // Build the path command string
                    tp += `${hasStarted ? 'L' : 'M'} ${r.x.toFixed(2)} ${r.y.toFixed(2)} `;
                    hasStarted = true;
                });

                if (flag) {
                    d += tp + 'Z ';
                }
            });

            // Set the path data string
            path.d = d;
        }
        path.update();
    }

    triangleMesh(topology: Topology, opacity = 0.5) {
        const allTriangles = {};

        // Create a single group for all triangle mesh polygons
        this.triangleMeshGroup = this.background.group();

        for (const [objectKey, geometryCollection] of Object.entries(topology.objects)) {

            const temp = extractPolygons({
                type: 'Topology',
                objects: { [objectKey]: geometryCollection },
                arcs: topology.arcs,
                transform: topology.transform
            });

            // let antartica = temp.slice(7, 8)[0];
            // this.drawAntartica(antartica, opacity);

            // let polygons = temp.slice(0, 7).concat(temp.slice(8, temp.length))
            let polygons = temp;


            // let polygons = this.limit(temp);
            // let polygons = [
            //     [
            //         [
            //             [170, 10],
            //             [170, -10],
            //             [-170, -10],
            //             [-170, 10],
            //             [170, 10],
            //         ],
            //     ]
            // ]

            polygons.forEach(polygon => {

                // Store all points for triangulation within this polygon
                let points = [];
                let rings = [];

                let first = true;
                polygon.forEach(ring => {

                    // ignore the first ring
                    if (!first) {
                        rings.push([])
                    }

                    ring.forEach(position => {
                        points.push(position);
                        if (!first) {
                            rings[rings.length - 1].push(position)
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

                    // If the difference in longitude is greater than 180, normalization is needed
                    if (Math.abs(x2 - x1) > 180) {
                        needsNormalization = true;
                        // console.log('Needs normalization', points, this.splitPolygonByAntimeridian(points))
                        break;
                    }
                }

                let pointsWithExtra = Array.from(points);

                const goldenRatio = (1 + Math.sqrt(5)) / 2;
                const goldenAngle = 2 * Math.PI * (1 - 1 / goldenRatio);

                const nPoints = 4000; // total number of points to generate

                for (let i = 0; i < nPoints; i++) {
                    const theta = goldenAngle * i;
                    const z = 1 - 2 * (i + 0.5) / nPoints;
                    const radius = Math.sqrt(1 - z * z);

                    const x = Math.cos(theta) * radius;
                    const y = Math.sin(theta) * radius;

                    const longitude = Math.atan2(y, x) * (180 / Math.PI);
                    const latitude = Math.asin(z) * (180 / Math.PI);

                    let coordinate: [number, number] = [longitude, latitude];

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
                const delaunayTriangles: Uint32Array = delaunay.triangles;

                const mesh: Array<{ a: [number, number], b: [number, number], c: [number, number] }> = [];

                for (let i = 0; i < delaunayTriangles.length; i += 3) {
                    const a = pointsWithExtra[delaunayTriangles[i]];
                    const b = pointsWithExtra[delaunayTriangles[i + 1]];
                    const c = pointsWithExtra[delaunayTriangles[i + 2]];

                    const centroid: [number, number] = [
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
                let vertices: Vector3[] = [];
                let triangles: { a: number, b: number, c: number }[] = [];

                // Helper function to add a vertex and return its index
                function addVertex(x: number, y: number): number {
                    const vector = positionToVector3(x, y);
                    const index = vertices.findIndex(v => v.equals(vector)); // Check if the vertex already exists
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
                let path = this.triangleMeshGroup.path();
                path.setAttribute('fill', 'var(--earth-green)');
                path.setAttribute('fill-opacity', opacity.toFixed(2));
                path.setAttribute('stroke-width', '1px');
                path.setAttribute('stroke-opacity', '0.5');
                path.addDependency(this.q, this.camera);
                path.update = () => {
                    let d = '';
                    let inverse = this.q.inverse();

                    // Precompute the transformed vertices and their projections
                    const transformedVertices: { [index: number]: Vector3 } = {};
                    const projectedPoints: { [index: number]: { x: number, y: number } } = {};

                    triangles.forEach(triangle => {
                        const { a, b, c } = triangle;

                        let tp = '';
                        let hasStarted = false;
                        let flag = false;

                        [a, b, c].forEach(vertexIndex => {
                            let t: Vector3;
                            let r: { x: number, y: number };

                            if (transformedVertices[vertexIndex]) {
                                // If the vertex has already been transformed, use the cached result
                                t = transformedVertices[vertexIndex];
                                r = projectedPoints[vertexIndex];
                            } else {
                                // Convert the vertex to a quaternion for rotation
                                let vertex = vertices[vertexIndex];
                                let vectorQuaternion = new Quaternion(0, vertex.x, vertex.y, vertex.z);

                                // Perform the rotation: q * v * q^(-1)
                                let rotatedQuaternion = this.q.multiply(vectorQuaternion).multiply(inverse);

                                // Convert the rotated quaternion back to a Vector3
                                t = rotatedQuaternion.toVector3();

                                // Cache the transformed vertex
                                transformedVertices[vertexIndex] = t;

                                // Project the point and convert to relative SVG coordinates
                                let p = this.camera.projectPoint(t);
                                r = this.viewPort.plot.SVGToRelative(p);

                                // Cache the projected point
                                projectedPoints[vertexIndex] = r;
                            }

                            // Create a new vector u and calculate distance
                            let u = new Vector3(t.x, t.y, -t.z);
                            let distance = this.camera.position.dot(u);

                            if (distance >= 1) {
                                flag = true;
                            }

                            // Build the path command string
                            tp += `${hasStarted ? 'L' : 'M'} ${r.x.toFixed(2)} ${r.y.toFixed(2)} `;
                            hasStarted = true;
                        });

                        if (flag) {
                            d += tp + 'Z ';
                        }
                    });

                    // Set the path data string
                    path.d = d;
                }
                path.update();
            });
        }

        return allTriangles;
    }


    drawContinents2(topology: Topology) {

        for (const [objectKey, geometryCollection] of Object.entries(topology.objects)) {
            const temp = extractPolygons({
                type: 'Topology',
                objects: { [objectKey]: geometryCollection },
                arcs: topology.arcs,
                transform: topology.transform
            });

            let x = 30
            let start = temp.length - x - 1;
            let end = temp.length - x;
            const polygons = temp.slice(start, end)
            // const polygons = temp;

            let path = this.background.path();
            // path.setAttribute('fill', 'var(--green)');
            path.setAttribute('stroke', 'var(--font-color)');
            path.setAttribute('stroke-width', '1px');
            path.setAttribute('stroke-opacity', '0.5');
            path.root.setAttribute('data-object', objectKey);
            path.addDependency(this.q, this.camera);
            path.update = () => {
                let clip = 0;
                let pathStarted = false;
                let lastVisible = false;
                let d = '';
                let r = this.camera.position.length();

                polygons.forEach(polygon => {
                    polygon.forEach(ring => {
                        ring.forEach((position, index) => {
                            let h = positionToVector3(position[0], position[1]);
                            let t = h.apply(this.q);

                            // Flip the z-coordinate to be a right-handed system when caclulatig the distance
                            let u = new Vector3(t.x, t.y, -t.z);
                            let distance = this.camera.position.dot(u);

                            if (distance > 1) {
                                let v = this.camera.projectPoint(t);
                                let u = this.viewPort.plot.SVGToRelative(v);

                                if (pathStarted) {
                                    d += `L ${u.x.toFixed(2)} ${u.y.toFixed(2)} `;
                                } else {
                                    d += `M ${u.x.toFixed(2)} ${u.y.toFixed(2)} `;
                                    pathStarted = true;
                                    lastVisible = true;
                                }
                            } else {
                                let s = r * 1 / Math.sqrt(r * r - 1);
                                t = new Vector3(t.x, t.y, -t.z).normalize().scale(2);

                                let v = this.camera.projectPoint(t);
                                let u = this.viewPort.plot.SVGToRelative(v);

                                if (pathStarted) {
                                    d += `L ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                                } else {
                                    d += `M ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                                    pathStarted = true;
                                }
                                clip++;
                                // lastVisible = false;
                            }
                        });
                        lastVisible = false;

                    });
                });

                path.d = d;
            }

            path.update();
        }
    }

    drawContinents(topology: Topology) {
        // Create a single group for the continents outline
        this.continentsOutlineGroup = this.background.group();

        for (const [objectKey, geometryCollection] of Object.entries(topology.objects)) {
            const temp = extractPolygons({
                type: 'Topology',
                objects: { [objectKey]: geometryCollection },
                arcs: topology.arcs,
                transform: topology.transform
            });

            let polygons = this.limit(temp);

            this.continentsOutline = this.continentsOutlineGroup.path();
            this.continentsOutline.setAttribute('stroke', 'var(--font-color)');
            this.continentsOutline.setAttribute('stroke-width', '1px');
            this.continentsOutline.setAttribute('stroke-opacity', '0.5');
            this.continentsOutline.root.setAttribute('data-object', objectKey);
            this.continentsOutline.addDependency(this.q, this.camera);
            this.continentsOutline.update = () => {
                let lastVisible = false;
                let d = '';

                polygons.forEach(polygon => {
                    polygon.forEach(ring => {
                        ring.forEach((position, index) => {
                            let h = positionToVector3(position[0], position[1]);
                            let t = h.apply(this.q);

                            // Flip the z-coordinate to be a right-handed system when caclulatig the distance
                            let u = new Vector3(t.x, t.y, -t.z);
                            let distance = this.camera.position.dot(u);

                            if (distance > 1) {
                                let v = this.camera.projectPoint(t);
                                let u = this.viewPort.plot.SVGToRelative(v);

                                if (lastVisible) {
                                    d += `L ${u.x.toFixed(2)} ${u.y.toFixed(2)} `;
                                } else {
                                    d += `M ${u.x.toFixed(2)} ${u.y.toFixed(2)} `;
                                    lastVisible = true;
                                }
                            } else {
                                lastVisible = false;
                            }
                        });
                        lastVisible = false;
                    });
                });

                this.continentsOutline.d = d;
            }

            this.continentsOutline.update();
        }
    }
}