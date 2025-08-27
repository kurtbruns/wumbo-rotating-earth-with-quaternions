import { Circle, Group, interpolateColor, Point, Quaternion, Scene3D, Tex, Vector2, Vector3 } from '@kurtbruns/vector';
import { CoordinateSystem3D } from '@kurtbruns/vector/dist/lib/quaternions/CoordinateSystem3D';
import { Sphere } from '@kurtbruns/vector/dist/lib/quaternions/Sphere';
import { ScenePlayer } from '@kurtbruns/vector';

type SphereOrientationSideBySideConfig = {
    leftQ?: Quaternion;
    rightQ?: Quaternion;
    drawRotationAxes?: boolean;
    positiveColor?: string;
    negativeColor?: string;
    drawRightRotationAxes?: boolean;
    labelBasisVectors?: boolean;
}

export class SphereOrientationSideBySide extends ScenePlayer {

    left: CoordinateSystem3D;
    right: CoordinateSystem3D;

    leftSphere: Sphere;
    rightSphere: Sphere;
    positiveAxis: Group;
    negativeAxis: Group;
    positiveAxisRight: Group;
    negativeAxisRight: Group;
    pathArrow: Group;

    rotationTex: Tex;

    constructor(config: SphereOrientationSideBySideConfig = {} ) {


        let defaultConfig = {
            leftQ: Quaternion.identity(),
            rightQ: Quaternion.identity(),
            drawRotationAxes: true,
            positiveColor: 'var(--pink)',
            negativeColor: 'var(--medium)',
            drawRightRotationAxes: false,
            labelBasisVectors: false,
        }

        config = { ...defaultConfig, ...config };

        let width = 960;
        let height = 540;

        super({
            width: width,
            height: height,
            responsive: false,
            background: false,
        });

        let background = this.frame.background.rectangle(0, 0, width, height);
        background.setAttribute('fill', 'var(--background)')

        this.drawDivider(16);

        let right = new CoordinateSystem3D(this.frame.background, {
            x: width/2,
            // y: (height - width/2)/2,
            width: width/2,
            height: height,
            viewportWidth: 0.048,
            viewportHeight: 0.048*height/(width/2),
            drawAxes: false,
            groundGrid: false,
            tickMarks: false,
            labelAxes:false,
            cameraPosition: new Vector3(0,0,5.5),
            cameraTrackBallRadius: 1.5,
            registerEventListeners: false,
        }) 

        let left = new CoordinateSystem3D(this.frame.background, {
            // x: width/2,
            width: width/2,
            height: height,
            viewportWidth: 0.048,
            viewportHeight: 0.048*height/(width/2),
            drawAxes: false,
            groundGrid: false,
            tickMarks: false,
            labelAxes:false,
            cameraPosition: new Vector3(0,0,5.5),
            cameraTrackBallRadius: 1.5,
            registerEventListeners: false,
        }) 


        this.left = left;
        this.right = right;

        this.leftSphere = new Sphere(left, { q: config.leftQ })
        this.leftSphere.drawSphere();
        this.leftSphere.drawCirclesOnSphereAlt();
        this.leftSphere.drawIJKOutOfSphere();
        this.leftSphere.registerEventListeners();
        this.leftSphere.showQuaternionTex(this.leftSphere.q, true, 'q_1 =');
        if( config.labelBasisVectors ){
            this.leftSphere.labelBasisVectors()
        }

        this.rightSphere = new Sphere(right, { q: config.rightQ })
        this.rightSphere.drawSphere();
        this.rightSphere.drawCirclesOnSphereAlt();
        this.rightSphere.drawIJKOutOfSphere();
        this.rightSphere.registerEventListeners();
        this.rightSphere.showQuaternionTex(this.rightSphere.q, true, 'q_2 =');
        if( config.labelBasisVectors ){
            this.rightSphere.labelBasisVectors()
        }

        let aNeg = new Vector3();
        aNeg.addDependency(this.leftSphere.q, this.rightSphere.q);
        aNeg.update = () => {
            let temp = this.rightSphere.q.multiply(this.leftSphere.q.conjugate()).toVector3();
            if( temp.length() > 0.00001 ){
                aNeg.set(temp.negate().normalize());
            }
        }
        aNeg.update();

        
        let a = new Vector3();
        a.addDependency(this.leftSphere.q, this.rightSphere.q);
        a.update = () => {
            let temp = this.rightSphere.q.multiply(this.leftSphere.q.conjugate()).toVector3();
            if( temp.length() > 0.00001 ){
                a.set(temp.normalize());
            }
        }
        a.update();


        if( config.drawRotationAxes ){

            this.positiveAxis = this.drawConeArrowOutOfSphere(left, a, 1, 1.4, config.positiveColor)
            this.negativeAxis = this.drawConeArrowOutOfSphere(left, aNeg, 1, 1.4, config.negativeColor)

            this.positiveAxis.appendChild(this.drawPointOnSphere(left, a, {color:config.positiveColor}))
            this.negativeAxis.appendChild(this.drawPointOnSphere(left, aNeg, {color:config.negativeColor}))
        }

        if (config.drawRightRotationAxes){
            this.positiveAxisRight = this.drawConeArrowOutOfSphere(right, a, 1, 1.4, config.positiveColor)
            this.negativeAxisRight = this.drawConeArrowOutOfSphere(right, aNeg, 1, 1.4, config.negativeColor)

            this.positiveAxisRight.appendChild(this.drawPointOnSphere(right, a, {color:config.positiveColor}))
            this.negativeAxisRight.appendChild(this.drawPointOnSphere(right, aNeg, {color:config.negativeColor}))
        }

        this.rotationTex = this.frame.tex('r = \\cos \\left( \\frac{\\theta}{2} \\right) + \\sin \\left( \\frac{\\theta}{2} \\right) \\left(xi + yj + zk\\right)');
        this.rotationTex.setAttribute('font-size', '18px');
        this.rotationTex.setColorAll('\\theta', '#72D6BF')
        this.rotationTex.setColorAll('\\left( xi + yj + zk\\right)', 'var(--pink)')
        this.rotationTex.moveTo(this.frame.width / 2, this.frame.height - 50);
        this.rotationTex.alignCenter();
        this.rotationTex.drawBackground(true, 'var(--background)', 3)
        this.rotationTex.setAttribute('opacity', '0')


    }

    drawPathArrow() : Group {
        // this.frame.controlPath()
        let path = this.frame.path('M 420 210 Q 477 170 540 210')
        path.setAttribute('stroke', 'var(--font-color)')
        path.setAttribute('stroke-width', '2.5')
        this.pathArrow = this.frame.pathArrow(path, 'var(--font-color)', 2.5)
        this.pathArrow.setAttribute('opacity', '0')
        return this.pathArrow;
    }

    drawPointOnSphere(coords: CoordinateSystem3D, p: Vector3, options: { color?: string, opacity?: number, radius?: number, s?: number } = {}): Circle {

        let defaultOptions = {
            color: 'var(--font-color)',
            opacity: 1,
            radius: 3,
            scale: false,
            s: 150,
        };

        options = { ...defaultOptions, ...options };

        let c = coords.foreground.circle(0, 0, 3);
        c.setAttribute('fill', options.color);
        c.setAttribute('opacity', `${options.opacity}`);
        c.addDependency(p)
        c.update = () => {

            let q = coords.camera.projectPoint(p);

            let relativePoint = coords.plot.viewportToFrame(q);
            c.cx = relativePoint.x;
            c.cy = relativePoint.y;
            if (q.z === 0) {
                c.setAttribute('opacity', '0')
            } else {
                c.setAttribute('opacity', '1')
            }

            let delta = 3e-1;
            let epsilon = 1e-1;
            let dot = new Vector3(0,0,1).dot(p);
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

    drawConeArrowOutOfSphere(coords:CoordinateSystem3D, v: Vector3, radius: number, multiplier: number = 1.5, color: string = "var(--font-color)", copy = false, coneRadius = 0.1) {

        let group = coords.plot.foreground.group();
        const vStart = new Vector3();
        const vEnd = new Vector3();

        vStart.addDependency(v);
        vStart.update = () => {
            vStart.set(v.normalize().scale(radius));
        };
        vStart.update();

        vEnd.addDependency(v);
        vEnd.update = () => {
            vEnd.set(v.normalize().scale(radius * multiplier));
        };
        vEnd.update();

        let l = group.line(0, 0, 0, 0)
        l.setAttribute('stroke', color);
        l.setAttribute('stroke-width', '1.5px');

        l.addDependency(vStart, vEnd, coords.camera);
        l.update = () => {

            let epsilon = 0.55;
            let dot = new Vector3(0, 0, 1).dot(vStart);
            if (dot < -epsilon) {
                l.setAttribute('opacity', '0');
            } else {
                l.setAttribute('opacity', Math.abs(dot + epsilon).toFixed(2));
            }

            let d = coords.camera.position.length();
            let s = d * 1 / Math.sqrt(d * d - 1);

            let temp = vStart;
            if (dot < 0.22) {
                temp = coords.camera.closestPointOnPlane(vStart, coords.camera.orientation).normalize().scale(s)
            }

            let t1 = coords.camera.projectPoint(temp);
            let t2 = coords.camera.projectPoint(vEnd);

            let p1 = coords.plot.viewportToFrame(t1);
            let p2 = coords.plot.viewportToFrame(t2);

            l.x1 = p1.x;
            l.y1 = p1.y;
            l.x2 = p2.x;
            l.y2 = p2.y;

        }
        l.update();
        group.appendChild(l);


        group.appendChild(this.drawDisappearingCone(coords, coneRadius, Quaternion.identity(), vEnd, color))
        // group.appendChild(this.drawDisappearingCone(coords, coneRadius, Quaternion.identity(), vEnd.copy(), color))
        
        return group;
    }


    drawDisappearingCone(coords: CoordinateSystem3D, radius: number, r: Quaternion = Quaternion.identity(), pos: Vector3 = new Vector3(0, 0, 1), color: string): Group {

        let normal = new Vector3(0, 0, 1)

        let maxOpacity = 0.75;
        let apexHeight = radius * 2.5;
        let fill = interpolateColor(color, "var(--background)")
        let longs = this.generateCircle(72, radius);
        let group = coords.plot.foreground.group();
        group.setAttribute('opacity', maxOpacity.toFixed(2))

        let apex = new Vector3();
        apex.addDependency(pos);
        apex.update = () => {
            let t = pos.add(pos.normalize().scale(apexHeight));
            apex.set(t)

            let epsilon = 0.5;
            // Adjust opacity based on the average dot product
            let dot = normal.dot(t.normalize());
            if (dot < 0) {
                group.setAttribute('opacity', (maxOpacity * Math.max(1 + 1.2 * dot, 0)).toFixed(2));
            } else {
                group.setAttribute('opacity', maxOpacity.toFixed(2));
            }
        }
        apex.update();

        let apexCircle = coords.drawPoint(apex, { radius: 0.8, color: color, opacity: 0.75 });

        // Create the base path outside of the numLines loop
        let base = group.path();
        base.setAttribute('stroke', color);
        base.setAttribute('fill', interpolateColor(interpolateColor(fill, "var(--background)"), "var(--background)"));
        base.setAttribute('fill-rule', 'nonzero');
        base.setAttribute('fill-opacity', '0.5');
        base.setAttribute('stroke-width', '1.5px');
        base.setAttribute('stroke-opacity', '0.15');
        base.addDependency(pos, apex, coords.camera, coords.camera.position, r);
        base.update = () => {
            let u = pos;
            let q = Quaternion.rotationToVector(u);
            let d = '';
            let visiblePoints = [];

            // Project all points of the circle base to 2D
            for (let j = 0; j < longs.length; j++) {
                let point = longs[j].copy().apply(q).add(u);
                let v = coords.camera.projectPoint(point);
                if (v.z !== 0) {  // Skip points that can't be projected
                    let w = coords.plot.viewportToFrame(v);
                    visiblePoints.push(w);
                }
            }

            let dot = normal.dot(u);

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
        outline.addDependency(pos, apex, coords.camera, coords.camera.position, normal, r);
        outline.update = () => {
            let u = pos;
            let a = coords.plot.viewportToFrame(coords.camera.projectPoint(apex));
            let b = coords.camera.projectPoint(apex);
            let q = Quaternion.rotationToVector(u);
            let d = '';
            let visiblePoints = [];

            let max: [Point, number] = null;
            let min: [Point, number] = null;

            let startIndex = null;
            let endIndex = null;

            // Project all points of the circle base to 2D
            for (let j = 0; j < longs.length; j++) {
                let point = longs[j].copy().apply(q).add(u);
                let v = coords.camera.projectPoint(point);
                if (v.z !== 0) {  // Skip points that can't be projected
                    let w = coords.plot.viewportToFrame(v);
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
            let dot = pos.z;
            if (dot < 0) {
                group.setAttribute('opacity', Math.max(1 + 1.4 * dot, 0).toFixed(2));
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

    drawDivider(width = 20) {
        const centerX = this.frame.width / 2;
        const startX = centerX - width / 2;
        const endX = centerX + width / 2;
        
        // Create background rectangle
        this.frame.background.rectangle(startX, 0, width, this.frame.height)
            .setAttribute('fill', 'var(--background)');

        // Create a group for the divider content
        const dividerGroup = this.frame.background.group();
        
        // Create clipping mask
        const clipPath = this.frame.clipPath();
        clipPath.rectangle(startX, 0, width, this.frame.height);
        
        // Apply clipping mask to the group
        dividerGroup.setAttribute('clip-path', `url(#${clipPath.root.id})`);
        
        // Draw diagonal lines manually
        const lineSpacing = width / 1.75; // Space between lines
        const numLines = Math.ceil(this.frame.height / lineSpacing) + 2; // Extra lines to ensure coverage
        
        for (let i = -1; i < numLines; i++) {
            const y = i * lineSpacing;
            
            // Calculate line endpoints for diagonal pattern
            const x1 = startX;
            const y1 = y;
            const x2 = endX;
            const y2 = y - width;
            
            // Only draw lines that intersect with the divider area
            if (y1 < this.frame.height || y2 > 0) {
                const line = dividerGroup.line(x1, y1, x2, y2);
                line.setAttribute('stroke', 'var(--faint)');
                line.setAttribute('stroke-width', '3px');
            }
        }
    }


}