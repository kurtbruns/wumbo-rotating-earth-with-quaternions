import { Circle, Group, interpolateColor, Line, Path, Point, Quaternion, Scene3D, Shape, StringValue, Tex, Value, Vector2, Vector3 } from '@kurtbruns/vector';
import { SphereScene } from "../SphereScene";

export class ExponentsIntuitionZeroToOne extends SphereScene {

    constructor() {
        super({
            showQuaternionTex: false,
        });

        // this.q.set(new Quaternion(0.88, 0.14, -0.17, 0.41).normalize());
        this.q.set(new Quaternion(-0.1855, 0.3381, 0.3258, 0.8632).normalize());



        let axis = new Vector3(0, 0, 1);
        
        let angleAndTValueXShift = 240;
        let angleAndTValueYBuffer = 24;

        this.drawStaticConeArrowOutOfSphere(axis, 1, 1.5, 'var(--pink)');

        let angleTexString = `\\frac{\\theta}{2}`;
        let angleTex = this.viewPort.frame.tex(`\\theta = \\frac{\\pi}{2}`);
        angleTex.setAttribute('font-size', '18px');
        angleTex.setColorAll(`\\frac{\\pi}{2}`, '#72D6BF')
        angleTex.alignCenter();
        angleTex.moveTo(this.viewPort.frame.width / 2 + angleAndTValueXShift, this.viewPort.frame.height/2 - angleAndTValueYBuffer);

        let rotationTex = this.viewPort.frame.tex(`r = \\cos \\left( ${angleTexString} \\right) + \\sin \\left( ${angleTexString} \\right) \\left(${axis.x}i + ${axis.y}j + ${axis.z}k\\right)`);
        rotationTex.setAttribute('font-size', '18px');
        rotationTex.setColorAll('\\theta', '#72D6BF')
        rotationTex.setColorAll(`\\left(${axis.x}i + ${axis.y}j + ${axis.z}k\\right)`, 'var(--pink)')
        rotationTex.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50);
        rotationTex.alignCenter();
        rotationTex.drawBackground(true, 'var(--background)', 3)
        // rotationTex.setAttribute('opacity', '0')

        let t = new Value(0);



        let r = Quaternion.fromAxisAngle(axis, Math.PI/2 * t.value);
        r.addDependency(t)
        r.update = () => {
            r.set(Quaternion.fromAxisAngle(axis, Math.PI/2 * t.value));
        }
        r.update();

        let q_copy = this.q.copy();
        this.q.addDependency(r)
        this.q.update = () => {
            this.q.set(r.multiply(q_copy));
        }
        this.q.update();


        let q0Tex = this.viewPort.frame.tex(`q_0 = ${this.q.toFormattedString()}`);
        q0Tex.setAttribute('font-size', '18px');
        q0Tex.alignCenter();
        q0Tex.moveTo(this.viewPort.frame.width / 2, 40);
        

        let qTex = this.viewPort.frame.tex(`q = r^t \\cdot q_0 = ${this.q.toFormattedString()}`);
        qTex.setAttribute('font-size', '18px');
        qTex.moveTo(40, 90);
        qTex.alignCenter();
        qTex.addDependency(this.q);
        qTex.update = () => {
            qTex.replace(`q = r^t \\cdot q_0 = ${this.q.toFormattedString()}`);
        }
        qTex.update();
        qTex.alignHorizontallyTo(q0Tex, '=')

        let radius = 200;
        let centerx = this.viewPort.frame.width / 2;
        let centery = this.viewPort.frame.height / 2;
        let centerPoint = new Point(centerx, centery);
        let rightPoint = new Point(centerx + radius, centery);
        let anglePoint = new Point(centerx + radius, centery - radius);
        anglePoint.addDependency(t)
        anglePoint.update = () => {
            let x = Math.cos(Math.PI/2 * t.value) * radius + centerx;
            let y = -Math.sin(Math.PI/2 * t.value) * radius + centery;
            anglePoint.set(new Point(x, y));
        }
        anglePoint.update();
        this.displayAngle(
            centerPoint, 
            rightPoint, 
            anglePoint, 
            50, true, '#72D6BF', false);
        let displayPath = this.displayAngle(
            centerPoint, 
            rightPoint, 
            anglePoint, 
            50, true, 'transparent', true);
        displayPath.setAttribute('stroke-width', '2px')
        // let arrow = this.viewPort.frame.pathArrow(displayPath, '#72D6BF')
        // arrow.setAttribute('opacity', '0')
        // this.displayPathArrow2(displayPath, '#72D6BF')

        let tTexShadow = this.viewPort.frame.tex(`t = ${t.value.toFixed(2)}`);
        tTexShadow.setAttribute('font-size', '18px');
        tTexShadow.moveTo(this.viewPort.frame.width / 2 + angleAndTValueXShift, this.viewPort.frame.height/2 + angleAndTValueYBuffer);
        tTexShadow.alignHorizontallyTo(angleTex, '=');
        tTexShadow.setAttribute('opacity', '0')
        

        let tTex = this.viewPort.frame.tex(`t = ${t.value.toFixed(2)}`);
        tTex.setAttribute('font-size', '18px');
        tTex.moveTo(this.viewPort.frame.width / 2 + angleAndTValueXShift, this.viewPort.frame.height/2 + angleAndTValueYBuffer);
        tTex.alignCenter();
        tTex.addDependency(t);
        tTex.update = () => {
            tTex.replace(`t = ${t.value.toFixed(2)}`);
            tTex.alignTo(tTexShadow, '=')
        }
        tTex.update();

        this.reset = () => {

            t.set(0)

            this.clear()

            this.wait()

            this.play([
                t.animate.setValue(1)
            ], 5)

            this.wait();

            this.play([
                t.animate.setValue(0.5)
            ], 3)

            this.wait()

            this.play([
                t.animate.setValue(2)
            ], 3)

            this.wait();

            this.play([
                t.animate.setValue(4)
            ], 3)

            this.wait();
        
        }

        this.reset();

    }

    displayAngle(p0: Point, p1: Point, p2: Point, r = 24, fullRotation = true, color = 'var(--font-color)', arcOnly = false): Path {

        let path = this.foreground.path('');

        if (!arcOnly) {
            path.setAttribute('fill', color);
            path.setAttribute('fill-opacity', '0.2');
        }

        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '1.5');

        path.addDependency(p0, p1, p2);
        path.update = () => {

            let a1 = Math.atan2(p1.y - p0.y, p1.x - p0.x);
            let a2 = Math.atan2(p2.y - p0.y, p2.x - p0.x);
            let angle = a2 - a1;

            // normalize
            if (angle < 0) {
                angle = 2 * Math.PI + angle;
            }

            let arcFlag : boolean;
            let sweepFlag : boolean;

            if(fullRotation) {
                arcFlag = (angle > Math.PI) ? false : true;
                sweepFlag = false;
            } else {
                arcFlag = false;
                sweepFlag = (angle > Math.PI) ? false : true;
            }
 
            let x1 = r * Math.cos(a1) + p0.x;
            let y1 = r * Math.sin(a1) + p0.y;
            let x2 = r * Math.cos(a2) + p0.x;
            let y2 = r * Math.sin(a2) + p0.y;

            if (arcOnly) {
                path.d = `
                M ${x1} ${y1}
                A ${r} ${r} 0 ${+arcFlag} ${+sweepFlag} ${x2} ${y2}`;
            } else {
                path.d = `
                M ${p0.x} ${p0.y}
                L ${x1} ${y1}
                A ${r} ${r} 0 ${+arcFlag} ${+sweepFlag} ${x2} ${y2}
                Z`;
            }
        };

        path.update();
        return path;
    }

    displayPathArrow2(path: Path, color: string = 'var(--font-color)', refX = 8.5): Group {

        const refY = 5;
        let scale = 1.5;
        let strokeWidth;
        if (strokeWidth = path.getAttribute('stroke-width')) {
            scale = Number(strokeWidth.replace(/px$/, ''));
        }

        let g = this.viewPort.frame.group();
        g.appendChild(path);
        let a = g.path(``);
        a.setAttribute('fill', color);
        // a.setAttribute('stroke', color);
        // a.setAttribute('stroke-linecap', 'round');

        a.addDependency(path);
        a.update = () => {
            const length = path.getTotalLength();
            const p1 = path.getPointAtLength(length - refX)
            const p2 = path.getPointAtLength(length - 1)

            if (length < 10) {
                const minScale = 0.1; // Minimum scale when length is 0
                const maxScale = scale; // Maximum scale when length is 5 or more

                // Interpolate scale based on the length
                scale = (length / 10) * (maxScale - minScale) + minScale;
            } else {
                scale = scale;
            }

            const x = p2.x;
            const y = p2.y;
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) + 0.5;

            const adjustedX = x - (refX * scale) * Math.cos(angle) + (refY * scale) * Math.sin(angle);
            const adjustedY = y - (refX * scale) * Math.sin(angle) - (refY * scale) * Math.cos(angle);

            // a.d = `M 0 0.5 L 6 5 L 0 9.5 `;
            a.d = `M 0 0.5 L 10 5 L 0 9.5 L 2 5 z`;
            a.setAttribute('transform', `translate(${adjustedX},${adjustedY}) rotate(${angle * (180 / Math.PI)}) scale(${scale})`);
        };
        a.update();



        return g;

    }







}