// import { Quaternion, Vector3 } from "../vector/src";
// import { SphereScene } from "./SphereScene";



// type Topology = {
//     type: 'Topology';
//     transform?: Transform;
//     objects: Record<string, GeometryCollection>;
//     arcs: Position[][];
//     bbox?: number[];
// };

// type Transform = {
//     scale: [number, number];
//     translate: [number, number];
// };

// type GeometryCollection = {
//     type: 'GeometryCollection';
//     geometries: GeometryObject[];
// };

// type GeometryObject = {
//     type: string;
//     geometries?: GeometryObject[];
//     arcs?: (number | number[])[];
//     coordinates?: number[] | number[][];
//     id?: string;
//     properties?: Record<string, any>;
// };

// type Position = [number, number];

// function transformPoint(transform: Transform, position: Position): Position {
//     return [
//         position[0] * transform.scale[0] + transform.translate[0],
//         position[1] * transform.scale[1] + transform.translate[1]
//     ];
// }

// function decodeArc(transform: Transform | undefined, arc: Position[]): Position[] {
//     let x = 0, y = 0;
//     return arc.map(position => {
//         const newPosition: Position = [0, 0];
//         newPosition[0] = (x += position[0]);
//         newPosition[1] = (y += position[1]);
//         if (transform) {
//             return transformPoint(transform, newPosition);
//         }
//         return newPosition;
//     });
// }

// function extractPolygons(topology: Topology): Position[][][] {
//     const polygons: Position[][][] = [];

//     for (const objectKey in topology.objects) {
//         const geometryCollection = topology.objects[objectKey];
//         for (const geometry of geometryCollection.geometries) {
//             extractGeometry(geometry, topology.transform, topology.arcs, polygons);
//         }
//     }

//     return polygons;
// }

// function extractGeometry(geometry: GeometryObject, transform: Transform | undefined, arcs: Position[][], polygons: Position[][][]) {
//     if (geometry.type === "GeometryCollection" && geometry.geometries) {
//         geometry.geometries.forEach(geo => extractGeometry(geo, transform, arcs, polygons));
//     } else if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
//         const polygonArcs = geometry.arcs as (number | number[])[];
//         polygonArcs.forEach(rings => {
//             const polygon: Position[][] = [];
//             (Array.isArray(rings) ? rings : [rings]).forEach(arcIndexes => {
//                 const ring: Position[] = [];
//                 let first = true;
//                 (Array.isArray(arcIndexes) ? arcIndexes : [arcIndexes]).forEach(arcIndex => {
//                     let arc = arcIndex >= 0 ? arcs[arcIndex] : arcs[~arcIndex].slice().reverse();
//                     let decodedArc = decodeArc(transform, arc);

//                     // Drop the first position of each subsequent arc except the first
//                     if (!first) {
//                         decodedArc.shift();
//                     }
//                     first = false;

//                     ring.push(...decodedArc);
//                 });
//                 polygon.push(ring);
//             });
//             polygons.push(polygon);
//         });
//     }
// }

// function positionToVector3(longitude: number, latitude: number): Vector3 {
//     const lonRad = longitude * (Math.PI / 180);
//     const latRad = latitude * (Math.PI / 180);

//     const x = Math.cos(latRad) * Math.cos(lonRad);
//     const y = Math.cos(latRad) * Math.sin(lonRad);
//     const z = Math.sin(latRad);

//     return new Vector3(x, y, z);
// }

// interface EarthConfig {
//     q?: Quaternion;
//     cameraPosition?: Vector3;
//     cameraOrientation?: Quaternion;
//     drawAxes?: boolean,
//     labelAxes?: boolean,
//     size?: number,
//     drawIJK?:boolean,
// }

// export class EarthScene extends SphereScene {

//     rotateCamera:boolean;

//     constructor(config: EarthConfig = {}) {


//         let defaultConfig: EarthConfig = {
//             cameraOrientation: new Quaternion(1, 0, 0, 0),
//             // cameraPosition: new Vector3(0, 0, -4.4),
//             cameraPosition: new Vector3(0, 0, -5),
//             q: new Quaternion(1, 0, 0, 0),
//             drawAxes: false,
//             labelAxes: false,
//             size: 1.5,
//             drawIJK: true,
//         };

//         config = { ...defaultConfig, ...config };

//         super({
//             drawAxes: config.drawAxes,
//             cameraOrientation: config.cameraOrientation,
//             cameraPosition: config.cameraPosition,
//             drawSphere: false,
//             drawSphereCircles: false,
//             drawIJK: config.drawIJK,
//         });

//         this.rotateCamera = false;

//         this.drawSphere(1, 0.1);

//         // fetch('./land-50m.json')
//         fetch('./land-110m.json')
//             .then(response => response.json())
//             .then((topology: Topology) => {
//                 this.drawContinents(topology);
//             })
//             .catch(error => {
//                 console.error('Error fetching the TopoJSON file:', error);
//             });

//     }


//     drawContinents(topology: Topology) {
//         for (const [objectKey, geometryCollection] of Object.entries(topology.objects)) {
//             const polygons = extractPolygons({
//                 type: 'Topology',
//                 objects: { [objectKey]: geometryCollection },
//                 arcs: topology.arcs,
//                 transform: topology.transform
//             });
//             // console.log(`Processing object: ${objectKey}`);


//             // Note: changed this for StarMapWithEarth
//             // let path = this.background.path();
//             let path = this.background.path();
//             path.setAttribute('stroke', 'var(--font-color)');
//             path.setAttribute('stroke-width', '1px');
//             // path.setAttribute('stroke-width', '1.5px');
//             path.setAttribute('stroke-opacity', '0.5');
//             // path.setAttribute('fill', 'var(--green)');
//             path.root.setAttribute('data-object', objectKey);
//             path.addDependency(this.q, this.camera);
//             path.update = () => {
//                 let lastVisible = false;

//                 let d = '';

//                 polygons.forEach(polygon => {
//                     polygon.forEach(ring => {
//                         ring.forEach((position, index) => {

//                             let h = positionToVector3(position[0], position[1]);
//                             let t = h.apply(this.q);

//                             // Flip the z-coordinate to be a right-handed system when caclulatig the distance
//                             let u = new Vector3(t.x, t.y, -t.z);
//                             let distance = this.camera.position.dot(u);

//                             if (distance > 1) {
//                                 let v = this.camera.projectPoint(t);
//                                 let u = this.viewPort.plot.SVGToRelative(v);

//                                 if (lastVisible) {
//                                     d += `L ${u.x.toFixed(2)} ${u.y.toFixed(2)} `;
//                                 } else {
//                                     d += `M ${u.x.toFixed(2)} ${u.y.toFixed(2)} `;
//                                     lastVisible = true;
//                                 }
//                             } else {
//                                 lastVisible = false;
//                             }


//                         });
//                         lastVisible = false;
//                     });
//                 });

//                 path.d = d;
//             }

//             path.update();
//         }
//     }

// }