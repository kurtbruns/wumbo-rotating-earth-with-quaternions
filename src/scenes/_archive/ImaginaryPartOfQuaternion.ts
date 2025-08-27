// import { Circle, Group, interpolateColor, Line, Quaternion, Scene3D, Shape, StringValue, Value, Vector2, Vector3 } from "../vector/src";
// import { PropCamera } from "./PropCamera";
// import { QScene } from "./QScene";

// export class ImaginaryPartOfQuaternion extends QScene {

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
//             drawAxes: false,
//             labelAxes: false,
//             // cameraOrientation:  new Quaternion(0, 0, 0, -1),


//             // cameraOrientation: new Quaternion(0.906, -0.229, 0.346, -0.087), 
//             // cameraPosition: new Vector3(5.868, 4.750, -6.557),


//             cameraOrientation: cameraOrientation,
//             cameraPosition: cameraPosition,

//             // cameraOrientation: new Quaternion(0.946, -0.104, 0.306, 0.016),
//             // cameraPosition: new Vector3(3.495, 1.119, -4.747),

//         });

//         // this.vector(this.origin, this.normal)

//         // let v = new Vector3(0,0,1);
//         // let copy = v.copy();
//         // v.addDependency(this.q);
//         // v.update = () => {
//         //     v.set(this.q.transform(copy));
//         // }
//         // v.update();
//         // this.drawPointOnSphere(v)

//         this.drawSphere();

//         this.drawCirclesOnSphere()

//         this.drawIJKOutOfSphere();
//         // this.drawIJKConesOutOfSphere();


//         // draws axis between current quaternion and identity
//         // this.drawQAxis();

//         // this.q.set(new Quaternion(0.69, 0.10, -0.71, -0.08).normalize());

//         this.q.set(new Quaternion(-0.67, -0.51, 0.13, 0.52).normalize());


//         // this.drawDisappearingCone(0.5, Quaternion.identity(), new Vector3(0, 0, 2), 'var(--blue)');
//         // this.drawDisappearingCone(0.1, Quaternion.identity(), new Vector3(0, 0, 1.5), 'var(--blue)');
//         // this.drawDisappearingCone(0.1, Quaternion.identity(), new Vector3(0, 0, -1.5),  'var(--orange)');


//         // this.drawDisappearingCone(0.1, Quaternion.identity(), new Vector3(0, 1.5, 0),  'var(--red)');
//         // this.drawDisappearingCone(0.1, Quaternion.identity(), new Vector3(0, -1.5, 0),  'var(--cyan)');

//         // this.drawDisappearingCone(0.1, Quaternion.identity(), new Vector3(1.5,0, 0),  'var(--green)');
//         // this.drawDisappearingCone(0.1, Quaternion.identity(), new Vector3(-1.5,0, 0),  'var(--purple)');

//         // this.drawConeArrowOutOfSphere(new Vector3(0, 0, 1), 1, 1.5, 'var(--blue)');


//         this.drawAxisBetween();

//     }
//     drawIJKConesOutOfSphere() {
//         this.drawConeArrowOutOfSphere(new Vector3(0, 0, 1), 1, 1.5, 'var(--blue)');
//         // this.drawConeArrowOutOfSphere(new Vector3(0, 0, -1), 1, 1.5, 'var(--orange)');

//         this.drawConeArrowOutOfSphere(new Vector3(0, 1,0 ), 1, 1.5, 'var(--red)');
//         // this.drawConeArrowOutOfSphere(new Vector3(0, -1, 0), 1, 1.5, 'var(--cyan)');

//         this.drawConeArrowOutOfSphere(new Vector3(1, 0,0 ), 1, 1.5, 'var(--green)');
//         // this.drawConeArrowOutOfSphere(new Vector3(-1, 0, 0), 1, 1.5, 'var(--purple)');

//     }

//     drawConeArrowOutOfSphere(v: Vector3, radius: number, multiplier: number = 1.5, color: string = "var(--font-color)", copy = false, coneRadius = 0.1) {

//         let group = this.viewPort.frame.group();
//         const vStart = new Vector3();
//         const vEnd = new Vector3();
    
//         vStart.addDependency(v, this.q);
//         vStart.update = () => {
//             vStart.set(this.q.transform(v.normalize().scale(radius)));
//         };
//         vStart.update();
    
//         vEnd.addDependency(v, this.q);
//         vEnd.update = () => {
//             vEnd.set(this.q.transform(v.normalize().scale(radius * multiplier)));
//         };
//         vEnd.update();

//         let l = this.viewPort.frame.line(0, 0, 0, 0)
//         l.setAttribute('stroke', color);
//         l.setAttribute('stroke-width', '1.5px');

//         l.addDependency(vStart, vEnd);
//         l.update = () => {

//             let epsilon = 0.55;
//             let dot = this.normal.dot(vStart);
//             if( dot < -epsilon) {
//                 l.setAttribute('opacity', '0');
//             } else {
//                 l.setAttribute('opacity', Math.abs(dot + epsilon).toFixed(2));
//             }

//             let temp = vStart;
//             if( dot <= 0) {
//                 temp = this.camera.closestPointOnPlane(vStart, this.camera.orientation).normalize()
//             }

//             let t1 = this.camera.projectPoint(temp);
//             let t2 = this.camera.projectPoint(vEnd);

//             let p1 = this.viewPort.plot.SVGToRelative(t1);
//             let p2 = this.viewPort.plot.SVGToRelative(t2);

//             l.x1 = p1.x;
//             l.y1 = p1.y;
//             l.x2 = p2.x;
//             l.y2 = p2.y;

//         }
//         l.update();
//         group.appendChild(l);

//         // TODO: hacky AF
//         if( copy) {
//             group.appendChild(this.drawDisappearingCone(coneRadius, Quaternion.identity(), vEnd, color));
//         } else {
//             group.appendChild(this.drawDisappearingCone(coneRadius, Quaternion.identity(), vEnd.copy(), color));

//         }
    
//         return group;
//     }
    



//     drawDisappearingCone(radius: number, r: Quaternion = Quaternion.identity(), pos: Vector3 = new Vector3(0, 0, 1), color: string) : Group {

        
//         let maxOpacity = 0.75;
//         let apexHeight = radius * 2.5;
//         let fill = interpolateColor(color, "var(--background)")
//         let longs = this.generateCircle(72, radius);
//         let group = this.viewPort.frame.group();
//         group.setAttribute('opacity', maxOpacity.toFixed(2))

//         let apex = new Vector3();
//         apex.addDependency(this.q, pos);
//         apex.update = () => {
//             let t = this.q.transform(pos.add(pos.normalize().scale(apexHeight)));
//             apex.set(t)

//             let epsilon = 0.5;
//             // Adjust opacity based on the average dot product
//             let dot = this.normal.dot(t.normalize());
//             if (dot < 0) {
//                 group.setAttribute('opacity', (maxOpacity * Math.max(1 + 1.2 * dot, 0)).toFixed(2));
//             } else {
//                 group.setAttribute('opacity', maxOpacity.toFixed(2));
//             }
//         }
//         apex.update();

//         let apexCircle = this.drawPoint(apex, { radius: 1, color: color });

//         // Create the base path outside of the numLines loop
//         let outline = group.path();
//         outline.setAttribute('stroke', color);
//         outline.setAttribute('fill', fill);
//         outline.setAttribute('fill-opacity', '0.5');
//         outline.setAttribute('stroke-width', '1.5px');
//         outline.setAttribute('stroke-opacity', '0.5');
//         outline.addDependency(pos, apex, this.camera, this.camera.position, this.q, this.normal, r);
//         outline.update = () => {
//             let u = this.q.transform(pos);
//             let a = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(apex));
//             let b = this.camera.projectPoint(apex);
//             let q = Quaternion.rotationToVector(u);
//             let d = '';
//             let visiblePoints = [];

//             let max: [DOMPoint, number] = null;
//             let min: [DOMPoint, number] = null;

//             let startIndex = null;
//             let endIndex = null;

//             // Project all points of the circle base to 2D
//             for (let j = 0; j < longs.length; j++) {
//                 let point = longs[j].copy().apply(q).add(u);
//                 let v = this.camera.projectPoint(point);
//                 if (v.z !== 0) {  // Skip points that can't be projected
//                     let w = this.viewPort.plot.SVGToRelative(v);
//                     visiblePoints.push(w);

//                     // let n = new Vector2(w.x - a.x, w.y - a.y);
//                     // let m = new Vector2(-a.x, -a.y);

//                     let n = new Vector2(v.x - b.x, v.y - b.y);
//                     let m = new Vector2(-b.x, -b.y);

//                     let angle = Math.atan2(n.y * m.x - n.x * m.y, n.x * m.x + n.y * m.y);
//                     // let angle = Math.acos(n.dot(m)/(n.length()*m.length()))
//                     if (max === null || max[1] < angle) {
//                         max = [w, angle]
//                         startIndex = j;
//                     }

//                     if (min === null || min[1] > angle) {
//                         min = [w, angle];
//                         endIndex = j;
//                     }
//                 }
//             }

//             // Draw the circle outline
//             if (max[1] - min[1] < Math.PI) {
//                 d += `M ${min[0].x} ${min[0].y} L ${a.x} ${a.y} L ${max[0].x} ${max[0].y}`;
//                 if (startIndex < endIndex) {

//                     let i = startIndex;
//                     d += `M ${visiblePoints[i].x.toFixed(2)} ${visiblePoints[i].y.toFixed(2)} `;
//                     while (i <= endIndex) {
//                         d += `L ${visiblePoints[i].x.toFixed(2)} ${visiblePoints[i].y.toFixed(2)} `;
//                         i++;
//                     }
    
//                 } else {
//                     let j = startIndex;
//                     d += `M ${visiblePoints[j].x.toFixed(2)} ${visiblePoints[j].y.toFixed(2)} `;
//                     while (j <= endIndex + visiblePoints.length) {
//                         d += `L ${visiblePoints[j % visiblePoints.length].x.toFixed(2)} ${visiblePoints[j % visiblePoints.length].y.toFixed(2)} `;
//                         j++;
//                     }
//                     // d += `L ${visiblePoints[startIndex].x.toFixed(2)} ${visiblePoints[startIndex].y.toFixed(2)} `;
    
//                     if (max[1] - min[1] >= Math.PI) {
//                         d += `L ${visiblePoints[startIndex].x.toFixed(2)} ${visiblePoints[startIndex].y.toFixed(2)} `;
//                     }
//                 }
//             } else {
//                 // Draw the circle base
//                 if (visiblePoints.length > 0) {
//                     d += `M ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
//                     for (let i = 1; i < visiblePoints.length; i++) {
//                         d += `L ${visiblePoints[i].x.toFixed(3)} ${visiblePoints[i].y.toFixed(3)} `;
//                     }
//                     d += `L ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
//                 }
//             }



//             outline.d = visiblePoints.length === 0 ? "" : d;
//             // Adjust opacity based on the average dot product
//             let dot = this.normal.dot(u);
//             if (dot < 0) {
//                 group.setAttribute('opacity', Math.max(1 + 1.2 * dot, 0).toFixed(2));
//             } else {
//                 group.setAttribute('opacity', '1');
//             }
//         };

//         outline.update();

//         // Create the base path outside of the numLines loop
//         let base = group.path();
//         base.setAttribute('stroke', color);
//         base.setAttribute('fill', interpolateColor(interpolateColor(fill, "var(--background)"), "var(--background)"));
//         base.setAttribute('fill-rule', 'nonzero');
//         base.setAttribute('fill-opacity', '0.5');
//         base.setAttribute('stroke-width', '1.5px');
//         base.setAttribute('stroke-opacity', '0.5');
//         base.addDependency(pos, apex, this.camera, this.camera.position, this.q, this.normal, r);
//         base.update = () => {
//             let u = this.q.transform(pos);
//             let q = Quaternion.rotationToVector(u);
//             let d = '';
//             let visiblePoints = [];

//             // Project all points of the circle base to 2D
//             for (let j = 0; j < longs.length; j++) {
//                 let point = longs[j].copy().apply(q).add(u);
//                 let v = this.camera.projectPoint(point);
//                 if (v.z !== 0) {  // Skip points that can't be projected
//                     let w = this.viewPort.plot.SVGToRelative(v);
//                     visiblePoints.push(w);
//                 }
//             }

//             let dot = this.normal.dot(u);
//             if (dot <= 0.5) {
//                 // Draw the circle base
//                 if (visiblePoints.length > 0) {
//                     d += `M ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
//                     for (let i = 1; i < visiblePoints.length; i++) {
//                         d += `L ${visiblePoints[i].x.toFixed(3)} ${visiblePoints[i].y.toFixed(3)} `;
//                     }
//                     d += `L ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
//                 }
//             }


//             base.d = visiblePoints.length === 0 ? "" : d;

//             if (dot < 0) {
//                 group.setAttribute('opacity', Math.max(1 + 1.2 * dot, 0).toFixed(2));
//             } else {
//                 group.setAttribute('opacity', '1');
//             }

//         };

//         base.update();

//         group.appendChild(apexCircle)

//         return group;
//     }


//     drawQuaternionAxis(q: Quaternion, normalize: boolean = false, color: string = "var(--font-color)"): Group {

//         let epsilon = 2e-10;
//         let v = new Vector3();
//         v.addDependency(q);
//         v.update = () => {
//             let t = q.toVector3();
//             if (t.length() > epsilon) {
//                 if (normalize) {
//                     v.set(t.normalize().scale(1.5))
//                 } else {
//                     v.set(t)
//                 }
//             }
//         }
//         v.update();

//         let p = new Vector3();
//         p.addDependency(q);
//         p.update = () => {
//             let t = q.toVector3();
//             if (t.length() > epsilon) {
//                 p.set(t.normalize())
//             }
//         }
//         p.update();

//         let np = new Vector3();
//         np.addDependency(q);
//         np.update = () => {
//             let t = q.negate().toVector3();
//             if (t.length() > epsilon) {
//                 np.set(t.normalize())
//             }
//         }
//         np.update();



//         let w = new Vector3();
//         w.addDependency(q);
//         w.update = () => {
//             let t = q.negate().toVector3();
//             if (t.length() > epsilon) {
//                 if (normalize) {
//                     w.set(t.normalize().scale(1.5))
//                 } else {
//                     w.set(t)

//                 }
//             }
//         }
//         w.update();


//         let c = this.drawPointOnSphere(p, { color: "var(--pink)" });
//         // TODO: make yellow when dark theme
//         let nc = this.drawPointOnSphere(np, { color: color });
//         // let nc = this.drawPointOnSphere(np, { color: interpolateColor(color, "var(--background)") });

//         // // hacky
//         // let opacity = new Value();
//         // opacity.addDependency(q, c);
//         // opacity.update = () => {
//         //     let epsilon = 0.25;
//         //     let dot = this.normal.dot(q.toVector3().normalize());
//         //     if( !isNaN(dot)) {
//         //         if (dot > epsilon) {
//         //             opacity.value = 1;
//         //             c.setAttribute('opacity', '1');
//         //         } else {
//         //             c.setAttribute('opacity', '0');
//         //         }

//         //         if (dot < -epsilon) {
//         //             nc.setAttribute('opacity', '1');
//         //         } else {
//         //             nc.setAttribute('opacity', '0');
//         //         }
//         //     }
//         // }
//         // opacity.update();

//         let g = this.viewPort.frame.group();

//         // this.sphereLabel(v, "+");
//         // this.sphereLabel(w, "-");


//         // let v1 = this.vector(this.origin, v, color);
//         // let v2 = this.vector(this.origin, w, interpolateColor(color, "var(--background)"));

//         // let v1 = this.drawVectorOnSphere(v, 1, 1.5, "var(--pink)");
//         // let v2 = this.drawVectorOnSphere(w, 1, 1.5, color);

//         let v1 = this.drawConeArrowOutOfSphere(v, 1, 1.5,  "var(--pink)", true, 0.125)
//         let v2 = this.drawConeArrowOutOfSphere(w, 1, 1.5, color, true, 0.125);

//         // this.drawDisappearingCone(0.1, Quaternion.identity(), v, 3);


//         // let v2 = this.drawVectorOnSphere(w, 1, 1.5, interpolateColor(color, "var(--background)"));
//         g.appendChild(v1);
//         g.appendChild(v2);
//         g.appendChild(c);
//         return g;
//     }

//     sphereLabel(v: Vector3, s: string) {

//         // let copy = v.copy().scale(1.5);
//         // v.addDependency(this.q);
//         // v.update = () => {
//         //     v.set(this.q.transform(copy));
//         // }
//         // v.update();

//         let t = this.tex(v, s);
//         t.addDependency(v, this.normal);
//         t.update = () => {
//             let p = this.camera.projectPoint(v.scale(1.4));
//             let q = this.viewPort.plot.SVGToRelative(p);
//             t.moveTo(q);

//             let dot = this.normal.dot(v.normalize());
//             if (dot < 0) {
//                 t.setAttribute('opacity', Math.max(1 + 2 * dot, 0).toFixed(2));
//             } else {
//                 t.setAttribute('opacity', '1')
//             }
//         }

//         return t;
//     }

//     drawPointOnSphere(p: Vector3, options: { color?: string, opacity?: number, radius?: number, s?: number } = {}): Circle {

//         let defaultOptions = {
//             color: 'var(--font-color)',
//             opacity: 1,
//             radius: 3,
//             scale: false,
//             s: 150,
//         };

//         options = { ...defaultOptions, ...options };

//         let c = this.viewPort.frame.circle(0, 0, 3);
//         c.setAttribute('fill', options.color);
//         c.setAttribute('opacity', `${options.opacity}`);
//         c.addDependency(p)
//         c.update = () => {

//             let q = this.camera.projectPoint(p);

//             let relativePoint = this.viewPort.plot.SVGToRelative(q);
//             c.cx = relativePoint.x;
//             c.cy = relativePoint.y;
//             if (q.z === 0) {
//                 c.setAttribute('opacity', '0')
//             } else {
//                 c.setAttribute('opacity', '1')
//             }

//             let delta = 3e-1;
//             let epsilon = 1e-1;
//             let dot = this.normal.dot(p);
//             if (isNaN(dot)) {
//                 console.log('isNaN')
//             } else {
//                 if (dot > delta) {
//                     c.setAttribute('opacity', '1')
//                 } else if (dot > epsilon) {
//                     c.setAttribute('opacity', ((dot - epsilon) / (delta - epsilon)).toFixed(2));
//                 } else {
//                     c.setAttribute('opacity', '0')
//                 }
//             }



//         }
//         c.update();
//         return c;
//     }

//     drawAxisBetween() {

//         let q0 = Quaternion.identity();
//         (window as any).save = () => {
//             q0.set(this.q);
//         }

//         let b = new Quaternion();
//         b.addDependency(q0, this.q);
//         b.update = () => {
//             b.set(this.q.multiply(q0.conjugate()));
//         }
//         b.update();

//         // let activeAxis = this.drawQuaternionAxis(this.q, true);
//         let axis = this.drawQuaternionAxis(b, true, "var(--font-color)");

//         // axis.setAttribute('opacity', '0');

//         // let axis: Group = null;

//         // TODO: have a resetScene method and an onstart method?
//         this.reset = () => {

//             // if (axis !== null) {
//             //     axis.root.remove();
//             // }

//             let q1 = this.q.copy();
//             // axis = this.drawQuaternionAxis(b, true, "var(--pink)");
//             // axis.setAttribute('opacity', '0');

//             this.clear()

//             // this.play([
//             //     axis.animate.setOpacity(1)
//             // ])

//             this.play([
//                 this.q.animate.slerp(q0, false)
//             ], 3)

//             this.wait();

//             this.play([
//                 this.q.animate.slerp(q1, false)
//             ], 3)

//             // this.play([
//             //     axis.animate.setOpacity(0)
//             // ])



//             // let r = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), Math.PI/2)
//             // let q1 = this.q.multiply(r);
//             // let b = q1.multiply(this.q.conjugate());
//             // prev = this.drawQuaternionAxis(b, true, "var(--pink)");

//             // let n = this.q.toVector3();

//             // this.clear();
//             // this.play([
//             //     this.q.animate.slerp(q1)
//             // ], 2)



//             // prev[0].setOpacity(0);
//             // prev[1].setOpacity(0);

//             // let current = this.q.copy();

//             // this.clear();

//             // this.play([
//             //     prev[0].animate.setOpacity(1),
//             //     prev[1].animate.setOpacity(1),
//             // ], 1.5)

//             // this.play([
//             //     this.q.animate.slerp(q0)
//             // ], 3)

//             // this.wait();

//             // this.play([
//             //     this.q.animate.slerp(current)
//             // ], 3)

//             // this.play([
//             //     prev[0].animate.setOpacity(0),
//             //     prev[1].animate.setOpacity(0),
//             // ], 1.5)

//         }

//     }


//     drawQAxis() {

//         this.drawQuaternionAxis(this.q);

//         let q0 = Quaternion.identity();
//         (window as any).save = () => {
//             q0.set(this.q);
//         }

//         this.reset = () => {

//             let current = this.q.copy();

//             this.clear();

//             this.play([
//                 this.q.animate.slerp(q0)
//             ], 3)

//             this.wait();

//             this.play([
//                 this.q.animate.slerp(current)
//             ], 3)


//         }
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