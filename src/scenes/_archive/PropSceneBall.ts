// import { Group, Quaternion, Scene3D, Vector3 } from '@kurtbruns/vector';
// import { PropCamera } from "./PropCamera";
// import { QScene } from "./QScene";

// export class PropSceneBall extends QScene {

//     propCamera: PropCamera;

//     constructor() {

//         // let cameraOrientation =  new Quaternion(0.930, -0.138, 0.337, -0.050);
//         // let cameraPosition = new Vector3(3.676, 1.744, -4.409);

//         let cameraOrientation = new Quaternion(1, 0, 0, 0);
//         let cameraPosition = new Vector3(0, 0, -6);


//         super({
//             drawSphere: false,
//             showQuaternionTex: true,
//             drawBasisVectors: false,
//             // cameraOrientation:  new Quaternion(0, 0, 0, -1),


//             // cameraOrientation: new Quaternion(0.906, -0.229, 0.346, -0.087), 
//             // cameraPosition: new Vector3(5.868, 4.750, -6.557),


//             cameraOrientation: cameraOrientation,
//             cameraPosition: cameraPosition,

//             // cameraOrientation: new Quaternion(0.946, -0.104, 0.306, 0.016),
//             // cameraPosition: new Vector3(3.495, 1.119, -4.747),

//         });

//         // this.vector(this.origin, this.normal)

//         this.drawCirclesOnSphere()

//         this.drawIJKOutOfSphere();

//         this.zAxis.setOpacity(0);
//         this.zAxisLabel.setAttribute('opacity', '0')

//         this.propCamera = new PropCamera(new Vector3(0, 0, 0));

//         // let w = 12.8;
//         // let aspectRatio = 16/9;
//         // let h = w/aspectRatio;

//         // let p = this.drawPath([
//         //     new Vector3(w/2, h/2, 0),
//         //     new Vector3(w/2, -h/2, 0),
//         //     new Vector3(-w/2, -h/2, 0),
//         //     new Vector3(-w/2, h/2, 0),
//         // ])

//         this.drawSphere(1)

//         this.reset = () => {
//             this.displayTex.setAttribute('opacity', '0');
//         }
//         this.reset();

//         this.play([
//             this.axes.animate.setOpacity(0),
//         ])

//         this.play([
//             this.camera.animate.change(Quaternion.identity(), 5),
//             this.displayTex.animate.setOpacity(1),
//         ], 3)

//     }

//     registerEventListeners(r = 2, invert = false) {

//         r = 1;
//         let isDragging = false;
//         let isSpaceDown = false;
//         let upAxis: 'x' | 'y' | 'z' = 'z';
//         let prevX: number = 0;
//         let prevY: number = 0;
//         let bbox = this.viewPort.frame.root.getBoundingClientRect();

//         /**
//          * Projects the coordinates onto the northern hemisphere of a sphere.
//          */
//         const projectOnTrackball = (touchX: number, touchY: number) => {

//             let x = (invert ? 1 : -1) * (touchX - bbox.left - bbox.width / 2) / bbox.height;
//             let y = (invert ? 1 : -1) * (touchY - bbox.top - bbox.height / 2) / bbox.height;
//             let z = 0.0;
//             let distance = x * x + y * y;
//             if (distance <= r * r / 2) {
//                 // Inside sphere
//                 z = Math.sqrt(r * r - distance);

//             } else {
//                 // On hyperbola
//                 z = (r * r / 2) / Math.sqrt(distance);

//             }

//             return new Vector3(-x, y, z).normalize();
//         }

//         // Mouse down handler
//         const handleMouseDown = (event: MouseEvent) => {
//             if (this.viewPort.frame.root.contains(event.target as HTMLElement)) {
//                 isDragging = true;
//                 bbox = this.viewPort.frame.root.getBoundingClientRect();
//                 this.viewPort.plot.setCTM();
//                 this.viewPort.plot.setBoundingRect();
//                 prevX = event.clientX;
//                 prevY = event.clientY;
//             }
//         };

//         // Mouse move handler
//         const handleMouseMove = (event: MouseEvent) => {

//             if (isDragging && (event.clientX !== prevX || event.clientY !== prevY)) {

//                 const v1 = projectOnTrackball(prevX, prevY);
//                 const v2 = projectOnTrackball(event.clientX, event.clientY);

//                 const q1 = Quaternion.fromVector(v1);
//                 const q2 = Quaternion.fromVector(v2);

//                 let r = q2.multiply(q1.conjugate());

//                 // Convert the global rotation to a local rotation
//                 // let localRotation = this.camera.orientation.conjugate().multiply(r).multiply(this.camera.orientation).normalize();

//                 // Apply the local rotation to the camera's orientation
//                 // this.camera.position.apply(localRotation);
//                 // this.camera.orientation = this.camera.orientation.multiply(localRotation.inverse());

//                 this.q.set(r.multiply(this.q));

//             } 

//             prevX = event.clientX;
//             prevY = event.clientY;
//         };

//         // Mouse up handler
//         const handleMouseUp = () => {
//             isDragging = false;
//             this.viewPort.plot.releaseBoundingRect();
//             this.viewPort.plot.releaseCTM();
//         };

//         let scaleFactor = 1.1;

//         // Keydown handler
//         const handleKeyDown = (event: KeyboardEvent) => {
//             switch (event.key) {
//                 case 'ArrowUp':
//                     this.camera.lookAt(this.origin, new Vector3(0, 0, -1));
//                     break;
//                 case 'ArrowDown':
//                     // Handle arrow down key
//                     this.camera.lookAt(this.origin, new Vector3(0, 0, 1));
//                     break;
//                 case 'ArrowLeft':
//                     // Handle arrow left key
//                     break;
//                 case 'ArrowRight':
//                     // Handle arrow right key
//                     break;
//                 case 'Enter':
//                     console.log(`cameraOrientation: ${this.camera.orientation.toConstructor((n) => n.toFixed(3))}, \n        cameraPosition: ${this.camera.position.toConstructor((n) => n.toFixed(3))},`);
//                     break;
//                 case '=':
//                     this.camera.position.set(this.camera.position.scale(1 / scaleFactor));
//                     // this.camera.position = this.camera.position.subtract(this.camera.position.normalize().copy());
//                     this.camera.updateDependents();
//                     break;
//                 case '-':
//                     this.camera.position.set(this.camera.position.scale(scaleFactor));
//                     // this.camera.position = this.camera.position.add(this.camera.position.normalize().copy());
//                     this.camera.updateDependents();
//                     break;
//                 case 'x':
//                     upAxis = 'x';
//                     this.camera.orientation.set(new Quaternion(1, 0, 0, 0).multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2)));
//                     this.camera.position.set(new Vector3(0, 0, -this.camera.position.length()))
//                     this.camera.orientation.updateDependents();
//                     this.camera.position.updateDependents();
//                     this.camera.updateDependents();


//                     // this.camera.lookAt(this.origin, new Vector3(-1, 0, 0));
//                     event.preventDefault();
//                     break;
//                 case 'y':
//                     upAxis = 'y';
//                     this.camera.orientation.set(new Quaternion(1, 0, 0, 0));
//                     this.camera.position.set(new Vector3(0, 0, -this.camera.position.length()))
//                     this.camera.orientation.updateDependents();
//                     this.camera.position.updateDependents();
//                     this.camera.updateDependents();

//                     // this.camera.lookAt(this.origin, new Vector3(0, -1, 0));
//                     event.preventDefault();
//                     break;
//                 case 'z':
//                     upAxis = 'z';
//                     // this.camera.orientation.set(new Quaternion(0, 0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
//                     this.camera.orientation.set(new Quaternion(0, 0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2).multiply(new Quaternion(0, 0, 0, 1)));
//                     this.camera.position.set(new Vector3(0, -this.camera.position.length(), 0));
//                     this.camera.orientation.updateDependents();
//                     this.camera.position.updateDependents();
//                     this.camera.updateDependents();



//                     // this.camera.orientation.set(Quaternion.identity());
//                     // this.camera.position.set(new Vector(this.camera.position.length()))
//                     event.preventDefault();
//                     break;
//                 case ' ':
//                     // Handle space bar
//                     isSpaceDown = true;
//                     event.preventDefault();
//                     break;
//                 default:
//                     // Handle other keys if necessary
//                     break;
//             }
//         };

//         const handleKeyUp = (event: KeyboardEvent) => {
//             switch (event.key) {
//                 case 'ArrowUp':
//                     break;
//                 case 'ArrowDown':
//                     break;
//                 case 'ArrowLeft':
//                     // Handle arrow left key
//                     break;
//                 case 'ArrowRight':
//                     // Handle arrow right key
//                     break;
//                 case 'Enter':
//                     break;
//                 case ' ':
//                     // Handle space bar
//                     isSpaceDown = false;
//                     // switch (upAxis) {
//                     //     case 'x':
//                     //         upAxis = 'x';
//                     //         this.camera.lookAt(this.origin, new Vector3(-1, 0, 0));
//                     //         break;
//                     //     case 'y':
//                     //         upAxis = 'y';
//                     //         this.camera.lookAt(this.origin, new Vector3(0, -1, 0));
//                     //         break;
//                     //     case 'z':
//                     //         upAxis = 'z';
//                     //         this.camera.lookAt(this.origin, new Vector3(0, 0, -1));
//                     //         break;
//                     // }
//                     // event.preventDefault();
//                     break;
//                 default:
//                     // Handle other keys if necessary
//                     break;
//             }
//         };

//         // Attach event listeners
//         window.addEventListener('mousedown', handleMouseDown);
//         window.addEventListener('mousemove', handleMouseMove);
//         window.addEventListener('mouseup', handleMouseUp);
//         window.addEventListener('keydown', handleKeyDown);
//         window.addEventListener('keyup', handleKeyUp);

//     }


//     // drawSphere(r: number = 1, opacity: number = 0.1): void {

//     //     let s = 144;
//     //     // let verticalN = 4;
//     //     // let horizontalN = 2;
//     //     let verticalN = 24;
//     //     let horizontalN = 12;
//     //     let identity = Quaternion.identity();

//     //     let longs = Scene3D.generateVerticalSlices(s, verticalN, identity);

//     //     for (let i = 0; i < longs.length; i++) {
//     //         let path = this.viewPort.frame.path();
//     //         path.setAttribute('stroke', 'var(--medium)');
//     //         path.setAttribute('stroke-width', '1.5px');
//     //         path.setAttribute('stroke-opacity', `${opacity}`)
//     //         path.addDependency(this.camera, this.q);
//     //         path.update = () => {

//     //             let lastVisible = false;
//     //             let d = '';
//     //             for (let j = 0; j < longs[i].length; j++) {

//     //                 let point = longs[i][j].copy();
//     //                 let t = point.apply(this.q);

//     //                 // Flip the z-coordinate to be a right-handed system when caclulatig the distance
//     //                 let u = new Vector3(t.x, t.y, -t.z);
//     //                 let distance = this.camera.position.dot(u);

//     //                 if (distance > 1) {
//     //                     let v = this.camera.projectPoint(t);
//     //                     let u = this.viewPort.plot.SVGToRelative(v);

//     //                     if (lastVisible) {
//     //                         d += `L ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
//     //                     } else {
//     //                         d += `M ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
//     //                         lastVisible = true;
//     //                     }
//     //                 } else {
//     //                     lastVisible = false;
//     //                 }
//     //             }

//     //             path.d = d;
//     //         }
//     //         path.update();
//     //     }

//     //     let lats = Scene3D.generateHorizontalSlices(horizontalN, s, identity);


//     //     for (let i = 0; i < lats.length; i++) {
//     //         let path = this.viewPort.frame.path();
//     //         path.setAttribute('stroke', 'var(--medium)')
//     //         path.setAttribute('stroke-width', '1.5px')
//     //         path.setAttribute('stroke-opacity', `${opacity}`)
//     //         path.addDependency(this.camera, this.q);

//     //         path.update = () => {

//     //             let d = '';
//     //             let lastVisible = false;

//     //             for (let j = 0; j < lats[i].length; j++) {

//     //                 let point = lats[i][j].copy();
//     //                 let t = point.apply(this.q);

//     //                 // Flip the z-coordinate to be a right-handed system when caclulatig the distance
//     //                 let u = new Vector3(t.x, t.y, -t.z);
//     //                 let distance = this.camera.position.dot(u);

//     //                 if (distance > 1) {
//     //                     let v = this.camera.projectPoint(t);
//     //                     let u = this.viewPort.plot.SVGToRelative(v);

//     //                     if (lastVisible) {
//     //                         d += `L ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
//     //                     } else {
//     //                         d += `M ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
//     //                         lastVisible = true;
//     //                     }
//     //                 } else {
//     //                     lastVisible = false;
//     //                 }
//     //             }

//     //             path.d = d;
//     //         }

//     //         path.update();
//     //     }

//     //     let w = new Vector3();
//     //     // this.drawPoint(w, { color: 'var(--main)' });
//     //     w.addDependency(this.camera);
//     //     w.update = () => {


//     //         let q = this.camera.orientation;
//     //         let c = this.camera.orientation.conjugate();

//     //         const forward = c.multiply(new Quaternion(0, 0, 0, -1)).multiply(q);
//     //         const up = c.multiply(new Quaternion(0, 0, 1, 0)).multiply(q);
//     //         const right = forward.toVector3().cross(up.toVector3());

//     //         // Flip again because it creates bad behavior if ya' don't.
//     //         w.set(new Vector3(right.x, right.y, -right.z));
//     //     }
//     //     w.update();
//     //     // this.vector(this.origin, w, 'var(--yellow)')


//     //     let outline = this.viewPort.frame.circle(0, 0, 0);
//     //     outline.setAttribute('stroke', 'var(--medium)')
//     //     outline.setAttribute('stroke-width', '1.5px')
//     //     outline.setAttribute('stroke-opacity', '0.5');
//     //     outline.addDependency(this.origin, this.camera.position, w);
//     //     outline.update = () => {

//     //         let d = this.camera.position.length();

//     //         // https://stackoverflow.com/questions/21648630/radius-of-projected-sphere-in-screen-space#:~:text=Let%20the%20sphere%20have%20radius,can%20be%20written%20as%20f%20.
//     //         let s = d * 1 / Math.sqrt(d * d - 1);
//     //         // let s = 1;

//     //         let center = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(this.origin));
//     //         let x = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(w.copy().scale(s)));

//     //         outline.cx = center.x;
//     //         outline.cy = center.y;
//     //         outline.r = Math.hypot(x.y - center.y, x.x - center.x);
//     //     }
//     //     outline.update();


//     //     let background = this.viewPort.frame.circle(0, 0, 0);
//     //     background.setAttribute('stroke', 'none')
//     //     background.setAttribute('fill', 'var(--background)')
//     //     background.setAttribute('opacity', '0.5')
//     //     background.addDependency(this.origin, this.camera.position, w);
//     //     background.update = () => {

//     //         let d = this.camera.position.length();

//     //         // https://stackoverflow.com/questions/21648630/radius-of-projected-sphere-in-screen-space#:~:text=Let%20the%20sphere%20have%20radius,can%20be%20written%20as%20f%20.
//     //         let s = d * 1 / Math.sqrt(d * d - 1);
//     //         // let s = 1;

//     //         let center = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(this.origin));
//     //         let x = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(w.copy().scale(s)));

//     //         background.cx = center.x;
//     //         background.cy = center.y;
//     //         background.r = Math.hypot(x.y - center.y, x.x - center.x);
//     //     }
//     //     background.update();
//     //     this.background.appendChild(background)


//     // }

// }