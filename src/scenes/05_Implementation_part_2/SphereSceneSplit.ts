import { Circle, Group, interpolateColor, Line, Path, Quaternion, Scene3D, Tex, Value, Vector2, Vector3 } from "../../vector/src";
import { SphereScene } from "../SphereScene";

export class SphereSceneSplit extends SphereScene {

    left: Quaternion;
    right: Quaternion;

    constructor() {


        super({
            drawSphere: false,
            drawBasisVectors: false,
            drawIJK: false,
            drawSphereCircles: false,
            // drawAxes: true,
            // size: 2,
        });
        this.left = this.q.copy();
        this.right = this.q.copy();
        this.q.addDependency(this.left);
        this.q.update = () => {
            this.q.set(this.left);
        }
        this.q.update();


        let radius = 0.25;
        let circle = this.drawCircleOnSphere(new Vector3(0, 0, -1), radius, 'var(--blue)');
        let circle2 = this.drawCircleOnSphere(new Vector3(1, 0, 0), radius, 'var(--red)');
        let circle3 = this.drawCircleOnSphere(new Vector3(0, 1, 0), radius, 'var(--green)');


        this.drawSphere(new Value(1), 0.2, false, 'var(--background-lighter');
        this.drawIJKOutOfSphere()



    }

    drawDisappearingCircle(radius: number, r: Quaternion = Quaternion.identity(), pos: Vector3 = new Vector3(0, 0, 0), sphereRadius: number = 1) {

        let longs = this.generateCircle(72, radius);

        let opacity = 0.75;
        let path = this.background.path();
        path.setAttribute('stroke', 'var(--font-color)');
        path.setAttribute('stroke-width', '1.5px');
        path.setAttribute('stroke-opacity', `${opacity}`)
        path.addDependency(this.camera, this.camera.position, this.camera.orientation, this.left, this.right, this.normal, r);
        path.update = () => {

            let r = this.camera.position.length();

            let u = this.left.multiply(Quaternion.fromVector(pos)).multiply(this.right.conjugate()).toVector3();
            let q = Quaternion.rotationToVector(u);
            let clip = 0;
            let pathStarted = false;
            let d = '';
            let dotAverage = 0;

            for (let j = 0; j < longs.length; j++) {

                let point = longs[j].copy();
                let t = point.apply(q).add(u);

                // Check if the point is in front of the plane
                let dot = this.normal.dot(t);
                dotAverage += dot;
                if (dot >= 0.2) {
                    let v = this.camera.projectPoint(t);
                    if (v.z === 0) {
                        clip++;
                    }

                    let u = this.viewPort.plot.SVGToRelative(v);
                    // console.log(t)

                    if (pathStarted) {
                        d += `L ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                    } else {
                        d += `M ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                        pathStarted = true; // Start the path
                    }
                } else {
                    clip++;
                }
            }

            path.d = clip === longs.length ? "" : d;

            const opacity = 0.75 * Math.abs(dotAverage / longs.length);

            path.setAttribute('stroke-opacity', opacity.toFixed(2));
            console.log();

            // path.d = d ;
        }
        path.update();

        return path;
        // this.viewPort.pathArrow(path)
        // path.attatchArrow(this.viewPort.defs, true);

    }


    drawIJKOutOfSphere(start = 1, end =1.5) {

        // Vector I
        let i = this.drawDependentVectorOnSphere(new Vector3(1, 0, 0), start, end, 'var(--red)');

        // Vector J
        let j = this.drawDependentVectorOnSphere(new Vector3(0, 1, 0), start, end, 'var(--green)');

        // Vector K
        let k = this.drawDependentVectorOnSphere(new Vector3(0, 0, 1), start, end, 'var(--blue)');

        this.basisVectors = this.foreground.group();
        this.basisVectors.appendChild(i);
        this.basisVectors.appendChild(j);
        this.basisVectors.appendChild(k);

    }

    orientPoint = (v: Vector3, q: Quaternion) => {
        let v_copy = v.copy();
        v.addDependency(this.left, this.right);
        v.update = () => {
            v.set(this.left.multiply(Quaternion.fromVector(v_copy)).multiply(this.right.conjugate()).toVector3())
        }
        v.update();
        return v;
    }

    drawSphere(radius: Value, opacity: number = 0.5, drawBackground = true, backgroundColor = 'var(--background)'): Group {

        let group = this.background.group();
        let lineGroup = group.group();

        // TODO: The value really should be set in the constructor
        this.sphereRadius = radius;

        let s = 144;
        let verticalN = 12;
        let horizontalN = 12;
        let identity = Quaternion.identity();

        let longs = this.generateVerticalSlices(s, verticalN, identity, 0);

        for (let i = 0; i < longs.length; i++) {
            let path = lineGroup.path();
            path.setAttribute('stroke', 'var(--medium)');
            path.setAttribute('stroke-width', '2px');
            path.setAttribute('stroke-opacity', `${opacity}`)
            path.addDependency(this.camera, this.camera.position, this.camera.orientation, this.left, this.right, radius);
            path.update = () => {
                let d = '';
                for (let j = 0; j < longs[i].length; j++) {
                    let point = longs[i][j].copy().scale(radius.value);
                    let t = this.left.multiply(Quaternion.fromVector(point)).multiply(this.right.conjugate()).toVector3();
                    let v = this.camera.projectPoint(t);
                    let u = this.viewPort.plot.SVGToRelative(v);

                    if (j === 0) {
                        d += `M ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                    } else {
                        d += `L ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                    }
                }
                path.d = d;
            }
            path.update();
        }

        let lats = Scene3D.generateHorizontalSlices(horizontalN, s, identity);

        for (let i = 0; i < lats.length; i++) {
            let path = lineGroup.path();
            path.setAttribute('stroke', 'var(--medium)')
            path.setAttribute('stroke-width', '2px')
            path.setAttribute('stroke-opacity', `${opacity}`)
            path.addDependency(this.camera, this.camera.position, this.camera.orientation, this.left, this.right, radius);

            path.update = () => {
                let d = '';
                for (let j = 0; j < lats[i].length; j++) {
                    let point = lats[i][j].copy().scale(radius.value);
                    let t = this.left.multiply(Quaternion.fromVector(point)).multiply(this.right.conjugate()).toVector3();
                    let v = this.camera.projectPoint(t);
                    let u = this.viewPort.plot.SVGToRelative(v);

                    if (j === 0) {
                        d += `M ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                    } else {
                        d += `L ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                    }
                }
                path.d = d;
            }
            path.update();
        }

        return group;
    }

    drawDependentVectorOnSphere(v: Vector3, radius: number, multiplier: number = 1.5, color: string = "var(--font-color)") {
        const vStart = new Vector3();
        const vEnd = new Vector3();

        vStart.addDependency(v, this.left, this.right);
        vStart.update = () => {
            vStart.set(this.left.multiply(Quaternion.fromVector(v.normalize().scale(radius))).multiply(this.right.conjugate()).toVector3());
        };
        vStart.update();

        vEnd.addDependency(v, this.left, this.right);
        vEnd.update = () => {
            vEnd.set(this.left.multiply(Quaternion.fromVector(v.normalize().scale(radius * multiplier))).multiply(this.right.conjugate()).toVector3());
        };
        vEnd.update();

        return this.dissappearingVector(vStart, vEnd, color);
    }

    dissappearingVector(v1: Vector3, v2: Vector3, color: string = 'var(--font-color)', opacity = 1): Line {
        v1.addDependency(this.camera);
        v2.addDependency(this.camera);

        let l = this.foreground.line(0, 0, 0, 0)
        l.setAttribute('stroke', color);
        l.setAttribute('opacity', opacity.toString());
        l.setAttribute('stroke-width', '1.5px');
        l.attatchArrow(this.viewPort.defs, false, color);

        l.addDependency(v1, v2);
        l.update = () => {
            let t1 = this.camera.projectPoint(v1);
            let t2 = this.camera.projectPoint(v2);

            if (t1.z === 0 || t2.z === 0) {
                l.setAttribute('opacity', '0');
            } else {
                let p1 = this.viewPort.plot.SVGToRelative(t1.x, t1.y);
                let p2 = this.viewPort.plot.SVGToRelative(t2.x, t2.y);

                l.x1 = p1.x;
                l.y1 = p1.y;
                l.x2 = p2.x;
                l.y2 = p2.y;
            }
        }
        l.update();

        return l;
    }

    drawConeArrowOutOfSphere(v: Vector3, radius: number, multiplier: number = 1.5, color: string = "var(--font-color)", copy = false, coneRadius = 0.1) {
        let group = this.viewPort.frame.group();
        const vStart = new Vector3();
        const vEnd = new Vector3();

        vStart.addDependency(v, this.left, this.right);
        vStart.update = () => {
            vStart.set(this.left.multiply(Quaternion.fromVector(v.normalize().scale(radius))).multiply(this.right.conjugate()).toVector3());
        };
        vStart.update();

        vEnd.addDependency(v, this.left, this.right);
        vEnd.update = () => {
            vEnd.set(this.left.multiply(Quaternion.fromVector(v.normalize().scale(radius * multiplier))).multiply(this.right.conjugate()).toVector3());
        };
        vEnd.update();

        let l = this.viewPort.frame.line(0, 0, 0, 0)
        l.setAttribute('stroke', color);
        l.setAttribute('stroke-width', '1.5px');

        l.addDependency(vStart, vEnd, this.camera);
        l.update = () => {
            let epsilon = 0.55;
            let dot = this.normal.dot(vStart);
            if (dot < -epsilon) {
                l.setAttribute('opacity', '0');
            } else {
                l.setAttribute('opacity', Math.abs(dot + epsilon).toFixed(2));
            }

            let d = this.camera.position.length();
            let s = d * 1 / Math.sqrt(d * d - 1);

            let temp = vStart;
            if (dot < 0.22) {
                temp = this.camera.closestPointOnPlane(vStart, this.camera.orientation).normalize().scale(s)
            }

            let t1 = this.camera.projectPoint(temp);
            let t2 = this.camera.projectPoint(vEnd);

            let p1 = this.viewPort.plot.SVGToRelative(t1);
            let p2 = this.viewPort.plot.SVGToRelative(t2);

            l.x1 = p1.x;
            l.y1 = p1.y;
            l.x2 = p2.x;
            l.y2 = p2.y;
        }
        l.update();
        group.appendChild(l);

        if (copy) {
            group.appendChild(this.drawDisappearingCone(coneRadius, Quaternion.identity(), vEnd, color));
        } else {
            group.appendChild(this.drawDisappearingCone(coneRadius, Quaternion.identity(), vEnd.copy(), color));
        }

        return group;
    }


    drawQuaternionAxis(q: Quaternion, normalize: boolean = false, color: string = "var(--font-color)"): Group {
        let g = this.viewPort.frame.group();
        let v = q.toVector3();
        if (normalize) {
            v = v.normalize();
        }
        let w = v.copy();
        let c = this.drawPointOnSphere(v, { color: color });
        let nc = this.drawPointOnSphere(w.negate(), { color: color });
        let v1 = this.drawConeArrowOutOfSphere(v, 1, 1.5, color, true, 0.11);
        let v2 = this.drawConeArrowOutOfSphere(w, 1, 1.5, color, true, 0.11);
        g.appendChild(v1);
        g.appendChild(v2);
        g.appendChild(c);
        g.appendChild(nc);
        return g;
    }

    sphereLabel(v: Vector3, s: string, scale: number = 1.4) {
        let t = this.tex(v, s);
        t.addDependency(v, this.normal, this.left, this.right);
        t.update = () => {
            let transformed = this.left.multiply(Quaternion.fromVector(v)).multiply(this.right.conjugate()).toVector3();
            let p = this.camera.projectPoint(transformed.scale(scale));
            let q = this.viewPort.plot.SVGToRelative(p);
            t.moveTo(q);

            let dot = this.normal.dot(transformed.normalize());
            if (dot < 0) {
                t.setAttribute('opacity', Math.max(1 + 2 * dot, 0).toFixed(2));
            } else {
                t.setAttribute('opacity', '1')
            }
        }
        t.update();
        return t;
    }

    drawPointOnSphere(p: Vector3, options: { color?: string, opacity?: number, radius?: number, s?: number } = {}): Circle {
        let defaultOptions = {
            color: 'var(--font-color)',
            opacity: 1,
            radius: 3,
            scale: false,
            s: 150,
        };

        options = { ...defaultOptions, ...options };

        let c = this.viewPort.frame.circle(0, 0, 3);
        c.setAttribute('fill', options.color);
        c.setAttribute('opacity', `${options.opacity}`);
        c.addDependency(p, this.left, this.right)
        c.update = () => {
            let transformed = this.left.multiply(Quaternion.fromVector(p)).multiply(this.right.conjugate()).toVector3();
            let q = this.camera.projectPoint(transformed);

            let relativePoint = this.viewPort.plot.SVGToRelative(q);
            c.cx = relativePoint.x;
            c.cy = relativePoint.y;
            if (q.z === 0) {
                c.setAttribute('opacity', '0')
            } else {
                c.setAttribute('opacity', '1')
            }

            let delta = 3e-1;
            let epsilon = 1e-1;
            let dot = this.normal.dot(transformed);
            if (isNaN(dot)) {
                console.log('isNaN')
            } else {
                if (dot > delta) {
                    c.setAttribute('opacity', '1')
                } else if (dot > epsilon) {
                    c.setAttribute('opacity', ((dot - epsilon) / (delta - epsilon)).toFixed(2));
                } else {
                    c.setAttribute('opacity', '0')
                }
            }
        }
        c.update();
        return c;
    }

    drawCircleOnSphere(center: Vector3, radius: number, color: string = 'var(--font-color)', opacity: number = 0.75): Path {
        let path = this.background.path();
        path.setAttribute('stroke', color);
        path.setAttribute('fill', color);
        path.setAttribute('stroke-width', '1.5px');
        path.setAttribute('stroke-opacity', `${opacity}`);
        path.setAttribute('fill-opacity', `0.25`);

        // Generate points in a circle on the sphere's surface
        let points: Vector3[] = [];
        let numPoints = 72;
        let centerNormalized = center.normalize();
        
        // Create a rotation that aligns the center with the z-axis
        let alignmentRotation = Quaternion.rotationToVector(centerNormalized);
        
        // Generate points in a circle around the z-axis
        for (let i = 0; i < numPoints; i++) {
            let angle = (2 * Math.PI * i) / numPoints;
            // Create a point in the xy-plane at the desired radius
            let point = new Vector3(
                Math.cos(angle) * Math.sin(radius),
                Math.sin(angle) * Math.sin(radius),
                Math.cos(radius)
            );
            // Rotate the point back to be relative to the center
            point = point.apply(alignmentRotation.conjugate());
            points.push(point);
        }

        path.addDependency(this.camera, this.camera.position, this.camera.orientation, this.left, this.right);
        path.update = () => {
            let d = '';
            let pathStarted = false;
            let visiblePoints = 0;

            for (let point of points) {
                // Apply the quaternion transformations
                let transformedPoint = this.left.multiply(Quaternion.fromVector(point)).multiply(this.right.conjugate()).toVector3();
                
                // Project the point to 2D
                let projectedPoint = this.camera.projectPoint(transformedPoint);
                
                if (projectedPoint.z !== 0) {
                    let relativePoint = this.viewPort.plot.SVGToRelative(projectedPoint);
                    
                    if (!pathStarted) {
                        d += `M ${relativePoint.x.toFixed(3)} ${relativePoint.y.toFixed(3)} `;
                        pathStarted = true;
                    } else {
                        d += `L ${relativePoint.x.toFixed(3)} ${relativePoint.y.toFixed(3)} `;
                    }
                    visiblePoints++;
                }
            }

            // Only draw the path if we have visible points
            path.d = visiblePoints > 0 ? d +'Z' : "";

            // Adjust opacity based on how much of the circle is visible
            const visibilityRatio = visiblePoints / points.length;
            path.setAttribute('stroke-opacity', (opacity * visibilityRatio).toFixed(2));
        };

        path.update();
        return path;
    }

    drawConeArrow(v: Vector3, color: string = "var(--font-color)", coneRadius = 0.1): Group {
        let group = this.viewPort.frame.group();
        
        // Draw the line from origin to vector tip
        let l = this.viewPort.frame.line(0, 0, 0, 0);
        l.setAttribute('stroke', color);
        l.setAttribute('stroke-width', '1.5px');
        l.setAttribute('stroke-opacity', '0.5');

        l.addDependency(v, this.camera);
        l.update = () => {
            let t1 = this.camera.projectPoint(new Vector3(0, 0, 0));
            let t2 = this.camera.projectPoint(v);

            let p1 = this.viewPort.plot.SVGToRelative(t1);
            let p2 = this.viewPort.plot.SVGToRelative(t2);

            l.x1 = p1.x;
            l.y1 = p1.y;
            l.x2 = p2.x;
            l.y2 = p2.y;
        }
        l.update();
        group.appendChild(l);

        // Draw the cone at the tip
        group.appendChild(this.drawDisappearingCone(coneRadius, Quaternion.identity(), v, color));

        return group;
    }

    registerEventListeners(r = 4, invert = false) {

        let isDragging = false;
        let isSpaceDown = false;
        this.upAxis = 'z';
        let prevX: number = 0;
        let prevY: number = 0;
        let bbox = this.viewPort.frame.root.getBoundingClientRect();


        /**
         * Projects the coordinates onto the northern hemisphere of a sphere.
         */
        const projectOnTrackball = (touchX: number, touchY: number) => {

            // let d = this.camera.position.length();
            // console.log(d)
            // let r = d*1/Math.sqrt(d*d - 1);

            // let x = touchX / window.innerWidth * 2 - 1;
            // let y = -(touchY / window.innerHeight * 2 - 1);

            let x = (invert ? 1 : -1) * (touchX - bbox.left - bbox.width / 2) / bbox.height;
            let y = (invert ? 1 : -1) * (touchY - bbox.top - bbox.height / 2) / bbox.height;
            let z = 0.0;
            let distance = x * x + y * y;
            if (distance <= r * r / 2) {
                // Inside sphere
                z = Math.sqrt(r * r - distance);

            } else {
                // On hyperbola
                z = (r * r / 2) / Math.sqrt(distance);

            }

            return new Vector3(-x, y, z).normalize();
        }

        // Mouse down handler
        const handleMouseDown = (event: MouseEvent) => {
            if (this.viewPort.frame.root.contains(event.target as HTMLElement)) {
                isDragging = true;
                bbox = this.viewPort.frame.root.getBoundingClientRect();
                this.viewPort.plot.setCTM();
                this.viewPort.plot.setBoundingRect();
                prevX = event.clientX;
                prevY = event.clientY;
            }
        };

        // Mouse move handler
        const handleMouseMove = (event: MouseEvent) => {

            if (isDragging && (event.clientX !== prevX || event.clientY !== prevY)) {

                if (isSpaceDown) {

                    const v1 = projectOnTrackball(prevX, prevY);
                    const v2 = projectOnTrackball(event.clientX, event.clientY);

                    const q1 = Quaternion.fromVector(v1);
                    const q2 = Quaternion.fromVector(v2);

                    let r = q2.multiply(q1.conjugate());

                    // Convert the global rotation to a local rotation
                    let localRotation = this.camera.orientation.conjugate().multiply(r).multiply(this.camera.orientation).normalize();

                    // Apply the local rotation to the camera's orientation
                    this.camera.position.apply(localRotation);
                    this.camera.orientation = this.camera.orientation.multiply(localRotation.inverse());


                } else {

                    let up_vec: Vector3;
                    let right_vec: Vector3;

                    if (this.upAxis === 'x') {

                        up_vec = new Vector3(0, 0, 1);
                        right_vec = new Vector3(0, -1, 0);

                        let q = this.camera.orientation.conjugate();
                        let c = q.conjugate();
                        let up = q.multiply(Quaternion.fromVector(up_vec)).multiply(c);
                        let forward = q.multiply(Quaternion.fromVector(right_vec)).multiply(c);

                        let scalar = 200;

                        // TODO: note this is different for some reason
                        let r = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), (event.clientX - prevX) / scalar);
                        let s = Quaternion.fromAxisAngle(up.toVector3().cross(forward.toVector3()).normalize(), (event.clientY - prevY) / scalar);

                        let u = r.multiply(s).normalize();

                        this.camera.position.apply(u);
                        this.camera.orientation = this.camera.orientation.multiply(u.inverse()).normalize();

                    } else if (this.upAxis === 'y') {

                        up_vec = new Vector3(0, 1, 0);
                        right_vec = new Vector3(0, 0, 1);

                        let q = this.camera.orientation.conjugate();
                        let c = q.conjugate();
                        let up = q.multiply(Quaternion.fromVector(up_vec)).multiply(c);
                        let forward = q.multiply(Quaternion.fromVector(right_vec)).multiply(c);

                        let scalar = 200;
                        let r = Quaternion.fromAxisAngle(up.toVector3().cross(forward.toVector3()).normalize(), (event.clientY - prevY) / scalar);
                        let s = Quaternion.fromAxisAngle(up_vec, (event.clientX - prevX) / scalar);

                        let u = s.multiply(r).normalize();

                        this.camera.position.apply(u);
                        this.camera.orientation = this.camera.orientation.multiply(u.inverse()).normalize();

                    } else {

                        up_vec = new Vector3(0, 0, 1);
                        right_vec = new Vector3(0, 1, 0);
                        let q = this.camera.orientation.conjugate();
                        let c = q.conjugate();
                        let up = q.multiply(Quaternion.fromVector(up_vec)).multiply(c);
                        let forward = q.multiply(Quaternion.fromVector(right_vec)).multiply(c);

                        let scalar = 200;
                        let r = Quaternion.fromAxisAngle(up.toVector3().cross(forward.toVector3()).normalize(), -(event.clientY - prevY) / scalar);
                        // let r = Quaternion.fromAxisAngle(forward.toVector3().cross(up.toVector3()).normalize(), (event.clientY - prevY)/scalar);
                        let s = Quaternion.fromAxisAngle(up_vec, -(event.clientX - prevX) / scalar);

                        let u = s.multiply(r).normalize();

                        this.camera.position.apply(u);
                        this.camera.orientation = this.camera.orientation.multiply(u.inverse()).normalize();
                    }

                }

                event.preventDefault();

            }

            prevX = event.clientX;
            prevY = event.clientY;


        };

        // Mouse up handler
        const handleMouseUp = () => {
            isDragging = false;
            this.viewPort.plot.releaseBoundingRect();
            this.viewPort.plot.releaseCTM();
        };

        let scaleFactor = 1.1;

        // Keydown handler
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.camera.lookAt(this.origin, new Vector3(0, 0, -1));
                    break;
                case 'ArrowDown':
                    // Handle arrow down key
                    this.camera.lookAt(this.origin, new Vector3(0, 0, 1));
                    break;
                case 'ArrowLeft':
                    // Handle arrow left key
                    break;
                case 'ArrowRight':
                    // Handle arrow right key
                    break;
                case 'Enter':
                    // console.log(`cameraOrientation: ${this.camera.orientation.toConstructor((n) => n.toFixed(3))}, \n        cameraPosition: ${this.camera.position.toConstructor((n) => n.toFixed(3))},`);
                    console.log(`let cameraOrientation = ${this.camera.orientation.toConstructor((n) => n.toFixed(5))}; \n        let cameraPosition = ${this.camera.position.toConstructor((n) => n.toFixed(5))};`);
                    break;
                case '=':
                    this.camera.position.set(this.camera.position.scale(1 / scaleFactor));
                    // this.camera.position = this.camera.position.subtract(this.camera.position.normalize().copy());
                    this.camera.updateDependents();
                    break;
                case '-':
                    this.camera.position.set(this.camera.position.scale(scaleFactor));
                    // this.camera.position = this.camera.position.add(this.camera.position.normalize().copy());
                    this.camera.updateDependents();
                    break;
                case 'x':
                    this.upAxis = 'x';
                    this.camera.orientation.set(new Quaternion(1, 0, 0, 0).multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2)));
                    this.camera.position.set(new Vector3(0, 0, -this.camera.position.length()))
                    this.camera.orientation.updateDependents();
                    this.camera.position.updateDependents();
                    this.camera.updateDependents();


                    // this.camera.lookAt(this.origin, new Vector3(-1, 0, 0));
                    event.preventDefault();
                    break;
                case 'y':
                    this.upAxis = 'y';
                    this.camera.orientation.set(new Quaternion(1, 0, 0, 0));
                    this.camera.position.set(new Vector3(0, 0, -this.camera.position.length()))
                    this.camera.orientation.updateDependents();
                    this.camera.position.updateDependents();
                    this.camera.updateDependents();

                    // this.camera.lookAt(this.origin, new Vector3(0, -1, 0));
                    event.preventDefault();
                    break;
                case 'z':
                    this.upAxis = 'z';
                    // this.camera.orientation.set(new Quaternion(0, 0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
                    this.camera.orientation.set(new Quaternion(0, 0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2).multiply(new Quaternion(0, 0, 0, 1)));
                    this.camera.position.set(new Vector3(0, -this.camera.position.length(), 0));
                    this.camera.orientation.updateDependents();
                    this.camera.position.updateDependents();
                    this.camera.updateDependents();



                    // this.camera.orientation.set(Quaternion.identity());
                    // this.camera.position.set(new Vector(this.camera.position.length()))
                    event.preventDefault();
                    break;
                case ' ':
                    // Handle space bar
                    isSpaceDown = true;
                    event.preventDefault();
                    break;
                default:
                    // Handle other keys if necessary
                    break;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    break;
                case 'ArrowDown':
                    break;
                case 'ArrowLeft':
                    // Handle arrow left key
                    break;
                case 'ArrowRight':
                    // Handle arrow right key
                    break;
                case 'Enter':
                    break;
                case ' ':
                    // Handle space bar
                    isSpaceDown = false;
                    // switch (upAxis) {
                    //     case 'x':
                    //         upAxis = 'x';
                    //         this.camera.lookAt(this.origin, new Vector3(-1, 0, 0));
                    //         break;
                    //     case 'y':
                    //         upAxis = 'y';
                    //         this.camera.lookAt(this.origin, new Vector3(0, -1, 0));
                    //         break;
                    //     case 'z':
                    //         upAxis = 'z';
                    //         this.camera.lookAt(this.origin, new Vector3(0, 0, -1));
                    //         break;
                    // }
                    // event.preventDefault();
                    break;
                default:
                    // Handle other keys if necessary
                    break;
            }
        };

        // Attach event listeners
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

    }
    
}