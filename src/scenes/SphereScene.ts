import { Circle, Group, interpolateColor, Line, Quaternion, Scene3D, Shape, StringValue, Value, Vector2, Vector3 } from "../vector/src";
import { QScene } from "./QScene";

export interface SphereSceneConfig {
    drawAxes?:boolean;
    cameraOrientation?: Quaternion;
    cameraPosition?: Vector3;
    drawSphere?:boolean;
    drawSphereCircles?:boolean;
    drawIJK?:boolean;
    drawBasisVectors?:boolean;
    showQuaternionTex?:boolean;
    size?:number,
}

export class SphereScene extends QScene {

    basisVectorLabels: Group;
    sphere: Group;
    sphereCircles: Group;

    constructor(config : SphereSceneConfig = {}) {

        let cameraOrientation = new Quaternion(1, 0, 0, 0);
        let cameraPosition = new Vector3(0, 0, -5.5);
        // let cameraPosition = new Vector3(0, 0, -5);

        let defaultConfig : SphereSceneConfig = {
            drawAxes: false,
            cameraOrientation: cameraOrientation,
            cameraPosition: cameraPosition,
            drawSphere: true,
            drawSphereCircles: true,
            drawBasisVectors: false,
            drawIJK: true,
            showQuaternionTex: true,
            size: 2.5,
    
        };

        config = { ...defaultConfig, ...config };

        super({
            drawSphere: false,
            showQuaternionTex: config.showQuaternionTex,
            drawBasisVectors: config.drawBasisVectors,
            drawAxes: config.drawAxes,
            labelAxes: config.drawAxes,

            cameraOrientation: config.cameraOrientation,
            cameraPosition: config.cameraPosition,
            size:config.size,

        });

        if(config.drawAxes) {
            this.zAxis.setOpacity(0);
            this.zAxisLabel.setAttribute('opacity', '0');
        }

        if(config.drawSphere) {
            this.sphere = this.drawSphere(new Value(1), 0.2, true, 'var(--background-lighter');
        }

        if(config.drawSphereCircles) {
            // this.drawCirclesOnSphere()
            this.sphereCircles = this.background.group();
            let paths = this.drawCirclesOnSphereAlt()
            for(let circle of paths) {
                this.sphereCircles.appendChild(circle);
            }
        }

        if(config.drawIJK) {
            this.drawIJKOutOfSphere();
            // this.drawIJKConesOutOfSphere();
        }


    }

    drawIJKConesOutOfSphere() {
        this.drawConeArrowOutOfSphere(new Vector3(0, 0, 1), 1, 1.25, 'var(--blue)');
        // this.drawConeArrowOutOfSphere(new Vector3(0, 0, -1), 1, 1.5, 'var(--orange)');

        this.drawConeArrowOutOfSphere(new Vector3(0, 1, 0), 1, 1.25, 'var(--green)');
        // this.drawConeArrowOutOfSphere(new Vector3(0, -1, 0), 1, 1.5, 'var(--cyan)');

        this.drawConeArrowOutOfSphere(new Vector3(1, 0, 0), 1, 1.25, 'var(--red)');
        // this.drawConeArrowOutOfSphere(new Vector3(-1, 0, 0), 1, 1.5, 'var(--purple)');
    }

    labelBasisVectors() {
        this.basisVectorLabels = this.viewPort.frame.group();

        let si = this.orientPoint(new Vector3(1, 0, 0).scale(1.25), this.q);
        let sj = this.orientPoint(new Vector3(0, 1, 0).scale(1.25), this.q);
        let sk = this.orientPoint(new Vector3(0, 0, 1).scale(1.25), this.q);
    
        let iLabel = this.sphereLabel(si, '\\hat{\\imath}').setColor('\\hat{\\imath}','var(--red)');
        let jLabel = this.sphereLabel(sj, '\\hat{\\jmath}').setColor('\\hat{\\jmath}','var(--green)');
        let kLabel = this.sphereLabel(sk, '\\hat{k}').setColor('\\hat{k}','var(--blue)');

        iLabel.setAttribute('font-size', '20px');
        jLabel.setAttribute('font-size', '20px');
        kLabel.setAttribute('font-size', '20px');

        iLabel.drawBackground(true);
        jLabel.drawBackground(true);
        kLabel.drawBackground(true);

        this.basisVectorLabels.appendChild(iLabel);
        this.basisVectorLabels.appendChild(jLabel);
        this.basisVectorLabels.appendChild(kLabel);

    }

    drawStaticConeArrowOutOfSphere(v: Vector3, radius: number, multiplier: number = 1.5, color: string = "var(--font-color)", coneRadius = 0.1) {
        let group = this.viewPort.frame.group();
        const vStart = new Vector3();
        const vEnd = new Vector3();

        vStart.addDependency(v);
        vStart.update = () => {
            vStart.set(v.normalize().scale(radius));
        };
        vStart.update();

        group.appendChild(this.drawPointOnSphere(vStart, { color: color }));

        vEnd.addDependency(v);
        vEnd.update = () => {
            vEnd.set(v.normalize().scale(radius * multiplier));
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
                l.setAttribute('opacity', (0.7 * Math.abs(dot + epsilon)).toFixed(2));
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

        group.appendChild(this.drawStaticDisappearingCone(coneRadius, vEnd, color));

        return group;
    }

    drawStaticDisappearingCone(radius: number, pos: Vector3 = new Vector3(0, 0, 1), color: string): Group {
        let maxOpacity = 0.75;
        let apexHeight = radius * 2.5;
        let longs = this.generateCircle(72, radius);
        let group = this.viewPort.frame.group();
        group.setAttribute('opacity', maxOpacity.toFixed(2))

        let apex = new Vector3();
        apex.addDependency(pos);
        apex.update = () => {
            let t = pos.add(pos.normalize().scale(apexHeight));
            apex.set(t)

            let epsilon = 0.5;
            // Adjust opacity based on the average dot product
            let dot = this.normal.dot(t.normalize());
            if (dot < 0) {
                group.setAttribute('opacity', (maxOpacity * Math.max(1 + 1.2 * dot, 0)).toFixed(2));
            } else {
                group.setAttribute('opacity', maxOpacity.toFixed(2));
            }
        }
        apex.update();

        let apexCircle = this.drawPoint(apex, { radius: 0.8, color: color, opacity: 0.75 });

        // Create the base path
        let base = group.path();
        base.setAttribute('stroke', color);
        base.setAttribute('fill', interpolateColor(color, 'var(--background)', 0.5));
        base.setAttribute('fill-rule', 'nonzero');
        base.setAttribute('fill-opacity', '0.5');
        base.setAttribute('stroke-width', '1.5px');
        base.setAttribute('stroke-opacity', '0.15');
        base.addDependency(pos, apex, this.camera, this.camera.position);
        base.update = () => {
            let u = pos;
            let q = Quaternion.rotationToVector(u);
            let d = '';
            let visiblePoints = [];

            // Project all points of the circle base to 2D
            for (let j = 0; j < longs.length; j++) {
                let point = longs[j].copy().apply(q).add(u);
                let v = this.camera.projectPoint(point);
                if (v.z !== 0) {  // Skip points that can't be projected
                    let w = this.viewPort.plot.SVGToRelative(v);
                    visiblePoints.push(w);
                }
            }

            let dot = this.normal.dot(u);

            // Always draw the circle base
            if (visiblePoints.length > 0) {
                d += `M ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
                for (let i = 1; i < visiblePoints.length; i++) {
                    d += `L ${visiblePoints[i].x.toFixed(3)} ${visiblePoints[i].y.toFixed(3)} `;
                }
                d += `L ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
            }

            base.d = visiblePoints.length === 0 ? "" : d;

            if (dot <= 0.4) {
                base.setAttribute('fill-opacity', '0.4');
                base.setAttribute('stroke-opacity', '0.4');
            } else {
                base.setAttribute('fill-opacity', '0');
                base.setAttribute('stroke-opacity', '0.15');
            }
        };

        base.update();

        // Create the outline path
        let outline = group.path();
        outline.setAttribute('stroke', color);
        outline.setAttribute('fill', color);
        outline.setAttribute('fill-opacity', '0.25');
        outline.setAttribute('stroke-width', '1.5px');
        outline.setAttribute('stroke-opacity', '0.5');
        outline.addDependency(pos, apex, this.camera, this.camera.position);
        outline.update = () => {
            let u = pos;
            let a = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(apex));
            let b = this.camera.projectPoint(apex);
            let q = Quaternion.rotationToVector(u);
            let d = '';
            let visiblePoints = [];

            let max: [DOMPoint, number] = null;
            let min: [DOMPoint, number] = null;

            let startIndex = null;
            let endIndex = null;

            // Project all points of the circle base to 2D
            for (let j = 0; j < longs.length; j++) {
                let point = longs[j].copy().apply(q).add(u);
                let v = this.camera.projectPoint(point);
                if (v.z !== 0) {  // Skip points that can't be projected
                    let w = this.viewPort.plot.SVGToRelative(v);
                    visiblePoints.push(w);

                    let n = new Vector2(v.x - b.x, v.y - b.y);
                    let m = new Vector2(-b.x, -b.y);

                    let angle = Math.atan2(n.y * m.x - n.x * m.y, n.x * m.x + n.y * m.y);
                    if (max === null || max[1] < angle) {
                        max = [w, angle]
                        startIndex = j;
                    }

                    if (min === null || min[1] > angle) {
                        min = [w, angle];
                        endIndex = j;
                    }
                }
            }

            // Draw the circle outline
            if (max[1] - min[1] < Math.PI) {
                d += `M ${min[0].x} ${min[0].y} L ${a.x} ${a.y} L ${max[0].x} ${max[0].y}`;
                if (startIndex < endIndex) {
                    let i = startIndex;
                    d += `M ${visiblePoints[i].x.toFixed(2)} ${visiblePoints[i].y.toFixed(2)} `;
                    while (i <= endIndex) {
                        d += `L ${visiblePoints[i].x.toFixed(2)} ${visiblePoints[i].y.toFixed(2)} `;
                        i++;
                    }
                } else {
                    let j = startIndex;
                    d += `M ${visiblePoints[j].x.toFixed(2)} ${visiblePoints[j].y.toFixed(2)} `;
                    while (j <= endIndex + visiblePoints.length) {
                        d += `L ${visiblePoints[j % visiblePoints.length].x.toFixed(2)} ${visiblePoints[j % visiblePoints.length].y.toFixed(2)} `;
                        j++;
                    }

                    if (max[1] - min[1] >= Math.PI) {
                        d += `L ${visiblePoints[startIndex].x.toFixed(2)} ${visiblePoints[startIndex].y.toFixed(2)} `;
                    }
                }
            } else {
                // Draw the circle base
                if (visiblePoints.length > 0) {
                    d += `M ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
                    for (let i = 1; i < visiblePoints.length; i++) {
                        d += `L ${visiblePoints[i].x.toFixed(3)} ${visiblePoints[i].y.toFixed(3)} `;
                    }
                    d += `L ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
                }
            }

            outline.d = visiblePoints.length === 0 ? "" : d;
            // Adjust opacity based on the average dot product
            let dot = this.normal.dot(u);
            if (dot < 0) {
                group.setAttribute('opacity', Math.max(1 + 1.2 * dot, 0).toFixed(2));
            } else {
                group.setAttribute('opacity', '1');
            }
        };

        outline.update();

        group.appendChild(apexCircle)

        return group;
    }


    drawConeArrowOutOfSphere(v: Vector3, radius: number, multiplier: number = 1.5, color: string = "var(--font-color)", copy = false, coneRadius = 0.1) {

        let group = this.viewPort.frame.group();
        const vStart = new Vector3();
        const vEnd = new Vector3();

        vStart.addDependency(v, this.q);
        vStart.update = () => {
            vStart.set(this.q.transform(v.normalize().scale(radius)));
        };
        vStart.update();

        vEnd.addDependency(v, this.q);
        vEnd.update = () => {
            vEnd.set(this.q.transform(v.normalize().scale(radius * multiplier)));
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

        // TODO: hacky AF
        if (copy) {
            group.appendChild(this.drawDisappearingCone(coneRadius, Quaternion.identity(), vEnd, color));
        } else {
            group.appendChild(this.drawDisappearingCone(coneRadius, Quaternion.identity(), vEnd.copy(), color));
        }

        return group;
    }

    drawDisappearingCone(radius: number, r: Quaternion = Quaternion.identity(), pos: Vector3 = new Vector3(0, 0, 1), color: string): Group {


        let maxOpacity = 0.75;
        let apexHeight = radius * 2.5;
        let fill = interpolateColor(color, "var(--background)")
        let longs = this.generateCircle(72, radius);
        let group = this.viewPort.frame.group();
        group.setAttribute('opacity', maxOpacity.toFixed(2))

        let apex = new Vector3();
        apex.addDependency(this.q, pos);
        apex.update = () => {
            let t = pos.add(pos.normalize().scale(apexHeight));
            apex.set(t)

            let epsilon = 0.5;
            // Adjust opacity based on the average dot product
            let dot = this.normal.dot(t.normalize());
            if (dot < 0) {
                group.setAttribute('opacity', (maxOpacity * Math.max(1 + 1.2 * dot, 0)).toFixed(2));
            } else {
                group.setAttribute('opacity', maxOpacity.toFixed(2));
            }
        }
        apex.update();

        let apexCircle = this.drawPoint(apex, { radius: 0.8, color: color, opacity: 0.75 });

        // Create the base path outside of the numLines loop
        let base = group.path();
        base.setAttribute('stroke', color);
        base.setAttribute('fill', interpolateColor(interpolateColor(fill, "var(--background)"), "var(--background)"));
        base.setAttribute('fill-rule', 'nonzero');
        base.setAttribute('fill-opacity', '0.5');
        base.setAttribute('stroke-width', '1.5px');
        base.setAttribute('stroke-opacity', '0.15');
        base.addDependency(pos, apex, this.camera, this.camera.position, this.q, this.normal, r);
        base.update = () => {
            let u = this.q.transform(pos);
            let q = Quaternion.rotationToVector(u);
            let d = '';
            let visiblePoints = [];

            // Project all points of the circle base to 2D
            for (let j = 0; j < longs.length; j++) {
                let point = longs[j].copy().apply(q).add(u);
                let v = this.camera.projectPoint(point);
                if (v.z !== 0) {  // Skip points that can't be projected
                    let w = this.viewPort.plot.SVGToRelative(v);
                    visiblePoints.push(w);
                }
            }

            let dot = this.normal.dot(u);

            // // conditionally draw the circle base if it's showing
            // if (dot <= 0.5) {
            //     // Draw the circle base
            //     if (visiblePoints.length > 0) {
            //         d += `M ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
            //         for (let i = 1; i < visiblePoints.length; i++) {
            //             d += `L ${visiblePoints[i].x.toFixed(3)} ${visiblePoints[i].y.toFixed(3)} `;
            //         }
            //         d += `L ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
            //     }
            // }

            // Always draw the circle base
            if (visiblePoints.length > 0) {
                d += `M ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
                for (let i = 1; i < visiblePoints.length; i++) {
                    d += `L ${visiblePoints[i].x.toFixed(3)} ${visiblePoints[i].y.toFixed(3)} `;
                }
                d += `L ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
            }


            base.d = visiblePoints.length === 0 ? "" : d;

            if (dot <= 0.4) {
                base.setAttribute('fill-opacity', '0.5');
                base.setAttribute('stroke-opacity', '0.5');
            } else {
                base.setAttribute('fill-opacity', '0');
                base.setAttribute('stroke-opacity', '0.2');
            }

        };

        base.update();

        // Create the base path outside of the numLines loop
        let outline = group.path();
        outline.setAttribute('stroke', color);
        outline.setAttribute('fill', fill);
        outline.setAttribute('fill-opacity', '0.5');
        outline.setAttribute('stroke-width', '1.5px');
        outline.setAttribute('stroke-opacity', '0.5');
        outline.addDependency(pos, apex, this.camera, this.camera.position, this.q, this.normal, r);
        outline.update = () => {
            let u = this.q.transform(pos);
            let a = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(apex));
            let b = this.camera.projectPoint(apex);
            let q = Quaternion.rotationToVector(u);
            let d = '';
            let visiblePoints = [];

            let max: [DOMPoint, number] = null;
            let min: [DOMPoint, number] = null;

            let startIndex = null;
            let endIndex = null;

            // Project all points of the circle base to 2D
            for (let j = 0; j < longs.length; j++) {
                let point = longs[j].copy().apply(q).add(u);
                let v = this.camera.projectPoint(point);
                if (v.z !== 0) {  // Skip points that can't be projected
                    let w = this.viewPort.plot.SVGToRelative(v);
                    visiblePoints.push(w);

                    // let n = new Vector2(w.x - a.x, w.y - a.y);
                    // let m = new Vector2(-a.x, -a.y);

                    let n = new Vector2(v.x - b.x, v.y - b.y);
                    let m = new Vector2(-b.x, -b.y);

                    let angle = Math.atan2(n.y * m.x - n.x * m.y, n.x * m.x + n.y * m.y);
                    // let angle = Math.acos(n.dot(m)/(n.length()*m.length()))
                    if (max === null || max[1] < angle) {
                        max = [w, angle]
                        startIndex = j;
                    }

                    if (min === null || min[1] > angle) {
                        min = [w, angle];
                        endIndex = j;
                    }
                }
            }

            // Draw the circle outline
            if (max[1] - min[1] < Math.PI) {
                d += `M ${min[0].x} ${min[0].y} L ${a.x} ${a.y} L ${max[0].x} ${max[0].y}`;
                if (startIndex < endIndex) {

                    let i = startIndex;
                    d += `M ${visiblePoints[i].x.toFixed(2)} ${visiblePoints[i].y.toFixed(2)} `;
                    while (i <= endIndex) {
                        d += `L ${visiblePoints[i].x.toFixed(2)} ${visiblePoints[i].y.toFixed(2)} `;
                        i++;
                    }

                } else {
                    let j = startIndex;
                    d += `M ${visiblePoints[j].x.toFixed(2)} ${visiblePoints[j].y.toFixed(2)} `;
                    while (j <= endIndex + visiblePoints.length) {
                        d += `L ${visiblePoints[j % visiblePoints.length].x.toFixed(2)} ${visiblePoints[j % visiblePoints.length].y.toFixed(2)} `;
                        j++;
                    }
                    // d += `L ${visiblePoints[startIndex].x.toFixed(2)} ${visiblePoints[startIndex].y.toFixed(2)} `;

                    if (max[1] - min[1] >= Math.PI) {
                        d += `L ${visiblePoints[startIndex].x.toFixed(2)} ${visiblePoints[startIndex].y.toFixed(2)} `;
                    }
                }
            } else {
                // Draw the circle base
                if (visiblePoints.length > 0) {
                    d += `M ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
                    for (let i = 1; i < visiblePoints.length; i++) {
                        d += `L ${visiblePoints[i].x.toFixed(3)} ${visiblePoints[i].y.toFixed(3)} `;
                    }
                    d += `L ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
                }
            }



            outline.d = visiblePoints.length === 0 ? "" : d;
            // Adjust opacity based on the average dot product
            let dot = this.normal.dot(u);
            if (dot < 0) {
                group.setAttribute('opacity', Math.max(1 + 1.2 * dot, 0).toFixed(2));
            } else {
                group.setAttribute('opacity', '1');
            }
        };

        outline.update();



        group.appendChild(apexCircle)

        return group;
    }

    generateCircle(longs: number, radius: number): Vector3[] {
        let slice: Vector3[] = [];

        let end = Math.floor(1 * longs);
        for (let longIndex = 0; longIndex <= end; longIndex++) {
            let long = (2 * Math.PI * longIndex / longs);

            let p = Scene3D.convertSphericalToCartesian(0, long).scale(radius);

            slice.push(p);
        }

        return slice;
    }

    drawQuaternionAxis(q: Quaternion, normalize: boolean = false, color: string = "var(--font-color)"): Group {

        let epsilon = 2e-10;
        let v = new Vector3();
        v.addDependency(q);
        v.update = () => {
            let t = q.toVector3();
            if (t.length() > epsilon) {
                if (normalize) {
                    v.set(t.normalize().scale(1.5))
                } else {
                    v.set(t)
                }
            }
        }
        v.update();

        let p = new Vector3();
        p.addDependency(q);
        p.update = () => {
            let t = q.toVector3();
            if (t.length() > epsilon) {
                p.set(t.normalize())
            }
        }
        p.update();

        let np = new Vector3();
        np.addDependency(q);
        np.update = () => {
            let t = q.negate().toVector3();
            if (t.length() > epsilon) {
                np.set(t.normalize())
            }
        }
        np.update();

        let w = new Vector3();
        w.addDependency(q);
        w.update = () => {
            let t = q.negate().toVector3();
            if (t.length() > epsilon) {
                if (normalize) {
                    w.set(t.normalize().scale(1.5))
                } else {
                    w.set(t)

                }
            }
        }
        w.update();


        let c = this.drawPointOnSphere(p, { color: "var(--pink)" });
        // TODO: make yellow when dark theme
        let nc = this.drawPointOnSphere(np, { color: color });
        // let nc = this.drawPointOnSphere(np, { color: interpolateColor(color, "var(--background)") });

        let g = this.viewPort.frame.group();


        // let v1 = this.vector(this.origin, v, color);
        // let v2 = this.vector(this.origin, w, interpolateColor(color, "var(--background)"));

        // let v1 = this.drawVectorOnSphere(v, 1, 1.5, "var(--pink)");
        // let v2 = this.drawVectorOnSphere(w, 1, 1.5, color);

        // let v1 = this.drawConeArrowOutOfSphere(v, 1, 1.25, "var(--pink)", true, 0.1)
        // let v2 = this.drawConeArrowOutOfSphere(w, 1, 1.25, color, true, 0.1);

        let v1 = this.drawConeArrowOutOfSphere(v, 1, 1.5, "var(--pink)", true, 0.11)
        let v2 = this.drawConeArrowOutOfSphere(w, 1, 1.5, color, true, 0.11);

        // this.drawDisappearingCone(0.1, Quaternion.identity(), v, 3);


        // let v2 = this.drawVectorOnSphere(w, 1, 1.5, interpolateColor(color, "var(--background)"));
        g.appendChild(v1);
        g.appendChild(v2);
        g.appendChild(c);
        g.appendChild(nc);
        return g;
    }

    sphereLabel(v: Vector3, s: string, scale: number = 1.4, fade: boolean = true) {

        // let copy = v.copy().scale(1.5);
        // v.addDependency(this.q);
        // v.update = () => {
        //     v.set(this.q.transform(copy));
        // }
        // v.update();

        let t = this.tex(v, s);
        t.addDependency(v, this.normal);
        t.update = () => {
            let p = this.camera.projectPoint(v.scale(scale));
            let q = this.viewPort.plot.SVGToRelative(p);
            t.moveTo(q);

            let dot = this.normal.dot(v.normalize());
            if (fade && dot < 0) {
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

        let c = this.viewPort.frame.circle(0, 0, options.radius);
        c.setAttribute('fill', options.color);
        c.setAttribute('opacity', `${options.opacity}`);
        c.addDependency(p)
        c.update = () => {

            let q = this.camera.projectPoint(p);

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
            let dot = this.normal.dot(p);
            if (!isNaN(dot)) {
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

    registerEventListeners(r = 2, invert = false) {

        r = 0.5;
        let isDragging = false;
        let isSpaceDown = false;
        let upAxis: 'x' | 'y' | 'z' = 'z';
        let prevX: number = 0;
        let prevY: number = 0;
        let bbox = this.viewPort.frame.root.getBoundingClientRect();

        /**
         * Projects the coordinates onto the northern hemisphere of a sphere.
         */
        const projectOnTrackball = (touchX: number, touchY: number) => {

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

                const v1 = projectOnTrackball(prevX, prevY);
                const v2 = projectOnTrackball(event.clientX, event.clientY);

                const q1 = Quaternion.fromVector(v1);
                const q2 = Quaternion.fromVector(v2);

                let r = q2.multiply(q1.conjugate()).pow(0.5);

                this.q.set(r.multiply(this.q));

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
                    console.log(this.q.toConstructor())
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
                    upAxis = 'x';
                    this.camera.orientation.set(new Quaternion(1, 0, 0, 0).multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2)));
                    this.camera.position.set(new Vector3(0, 0, -this.camera.position.length()))
                    this.camera.orientation.updateDependents();
                    this.camera.position.updateDependents();
                    this.camera.updateDependents();


                    // this.camera.lookAt(this.origin, new Vector3(-1, 0, 0));
                    event.preventDefault();
                    break;
                case 'y':
                    upAxis = 'y';
                    this.camera.orientation.set(new Quaternion(1, 0, 0, 0));
                    this.camera.position.set(new Vector3(0, 0, -this.camera.position.length()))
                    this.camera.orientation.updateDependents();
                    this.camera.position.updateDependents();
                    this.camera.updateDependents();

                    // this.camera.lookAt(this.origin, new Vector3(0, -1, 0));
                    event.preventDefault();
                    break;
                case 'z':
                    upAxis = 'z';
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