import { Circle, Group, interpolateColor, Line, Path, Point, Quaternion, Scene3D, Shape, StringValue, Tex, Value, Vector2, Vector3 } from "../../vector/src";
import { SphereOrientationSideBySide } from "../SphereOrientationSideBySide";

export class ExponentsIntuition extends SphereOrientationSideBySide {

    constructor() {
        let initialQ = new Quaternion(-0.1855, 0.3381, 0.3258, 0.8632).normalize();
        
        super({
            leftQ: initialQ.copy(),
            rightQ: initialQ.copy(),
            drawRotationAxes: false,
        });

        let xShift = 0
        let spacing = 50
        // let q1Tex = this.frame.tex(`q_1 = ${this.leftSphere.q.toFormattedString()}`);
        // q1Tex.setAttribute('font-size', '18px');
        // q1Tex.moveTo(this.frame.width / 2 - xShift, spacing);
        // q1Tex.alignCenter();


        let q2Tex = this.frame.tex(`q_2 = r \\cdot q_1`);
        q2Tex.setAttribute('font-size', '20px');
        q2Tex.moveTo(this.frame.width / 2 - xShift, 2*spacing);
        q2Tex.alignCenter();
        q2Tex.drawBackground(true, 'var(--background)', 4)
        q2Tex.setAttribute('opacity', '0')
        q2Tex.setOpacityOfParts('\\cdot q_1', 0)

        let q2TexDouble = this.frame.tex(`q_2 = r ^2 \\cdot q_1`);
        q2TexDouble.setAttribute('font-size', '20px');
        q2TexDouble.moveTo(this.frame.width / 2 - xShift, 2*spacing);
        q2TexDouble.setAttribute('opacity', '0')
        q2TexDouble.alignCenter();
        q2TexDouble.drawBackground(true, 'var(--background)', 4)
        q2TexDouble.alignTo(q2Tex, '=')
        q2TexDouble.setOpacityOfParts('\\cdot q_1', 0)

        let q2TexHalf = this.frame.tex(`q_2 = r ^\\frac{1}{2} \\cdot q_1`);
        q2TexHalf.setAttribute('font-size', '20px');
        q2TexHalf.moveTo(this.frame.width / 2 - xShift, 2*spacing);
        q2TexHalf.setAttribute('opacity', '0')
        q2TexHalf.alignCenter();
        q2TexHalf.drawBackground(true, 'var(--background)', 4)
        q2TexHalf.alignTo(q2Tex, '=')
        q2TexHalf.setOpacityOfParts('\\cdot q_1', 0)

    

        let axis = new Vector3(0, 0, 1);
        let t = new Value(0);

        let q2InterpolateTex = this.frame.tex(`q_2 = r^t \\cdot q_1`);
        q2InterpolateTex.setAttribute('font-size', '20px');
        q2InterpolateTex.moveTo(this.frame.width / 2 - xShift, 2*spacing);
        q2InterpolateTex.setAttribute('opacity', '0')
        q2InterpolateTex.drawBackground(true, 'var(--background)', 4)
        q2InterpolateTex.alignCenter();        
        q2InterpolateTex.alignTo(q2Tex, '=')
        q2InterpolateTex.setOpacityOfParts('\\cdot q_1', 0)
        // q2InterpolateTex.addDependency(t)
        // q2InterpolateTex.update = () => {
        //     q2InterpolateTex.replace(`q_2 = r^{${t.value.toFixed(2)}} \\cdot q_1`);
        //     q2InterpolateTex.alignTo(q2Tex, '=')
        // }
        // q2InterpolateTex.update();


        let cdotQ1Tex = this.frame.tex(`\\cdot q_1`, 0, 0, false);
        cdotQ1Tex.setAttribute('font-size', '20px');
        cdotQ1Tex.moveTo(this.frame.width / 2 - xShift, 2*spacing);
        cdotQ1Tex.alignCenter();
        cdotQ1Tex.setAttribute('opacity', '0')
        cdotQ1Tex.alignTo(q2Tex, '\\cdot q_1')

        let tValueTex = this.frame.tex(`t = 0`);
        tValueTex.setAttribute('font-size', '20px');
        tValueTex.moveTo(this.frame.width / 2 - xShift, 3*spacing);
        tValueTex.setAttribute('opacity', '0')
        tValueTex.alignCenter();
        tValueTex.alignHorizontallyTo(q2Tex, '=')
        tValueTex.addDependency(t)
        tValueTex.update = () => {
            tValueTex.replace(`t = ${t.value.toFixed(2)}`);
            tValueTex.alignHorizontallyTo(q2Tex, '=')
            tValueTex.drawBackground(true, 'var(--background)', 4)
        }
        tValueTex.update();

        let r = Quaternion.fromAxisAngle(axis, Math.PI/2 * t.value);
        r.addDependency(t)
        r.update = () => {
            r.set(Quaternion.fromAxisAngle(axis, Math.PI/2 * t.value));
        }
        r.update();

        let q_copy = this.leftSphere.q.copy();
        this.rightSphere.q.addDependency(r)
        this.rightSphere.q.update = () => {
            this.rightSphere.q.set(r.multiply(q_copy));
        }
        this.rightSphere.q.update();

        this.drawConeArrowOutOfSphere(this.left, axis, 1, 1.5, 'var(--pink)');

        let angleTexString = `\\frac{\\theta}{2}`;
        let angleTex = this.frame.tex(`\\theta = \\frac{\\pi}{2}`);
        angleTex.setAttribute('font-size', '20px');
        angleTex.setColorAll(`\\frac{\\pi}{2}`, '#72D6BF')
        angleTex.moveTo(this.frame.width / 2, this.frame.height - 120);
        angleTex.alignCenter();
        angleTex.setAttribute('opacity', '0')
        // rotationTex.setAttribute('opacity', '0')

        let rotationTex2= this.frame.tex(`r = \\cos \\left( \\frac{\\pi}{4} \\right) + \\sin \\left( \\frac{\\pi}{4} \\right) \\left( 0i + 0j + 1k \\right)`);
        rotationTex2.setAttribute('font-size', '18px');
        rotationTex2.setColorAll('\\frac{\\pi}{4}', '#72D6BF')
        rotationTex2.setColorAll(`\\left( 0i + 0j + 1k \\right)`, 'var(--pink)')
        rotationTex2.moveTo(this.frame.width / 2, this.frame.height - 50);
        rotationTex2.alignCenter();
        rotationTex2.drawBackground(true, 'var(--background)', 6)
        rotationTex2.setAttribute('opacity', '0')

        let braceLabelGroup = this.frame.group();
        this.left.plot.displayBraceLabel(rotationTex2.getPartsByTex(`\\cos \\left( \\frac{\\pi}{4} \\right) + \\sin \\left( \\frac{\\pi}{4} \\right) \\left( xi + yj + zk \\right)`),
        `\\text{Rotate around the }z\\text{-axis by 90 degrees}`, {
            reverse: true,
            space: 6,
            color: 'var(--font-color)',
            buff: 36,
            position: 'above',
            group: braceLabelGroup
        })
        braceLabelGroup.setOpacity(0);

        

        let radius = 200;
        let centerx = this.frame.width * 0.75;
        let centery = this.frame.height * 0.5;
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
        let displayPath = this.displayAngle(
            centerPoint, 
            rightPoint, 
            anglePoint, 
            50, true, '#72D6BF', false);
        // this.displayAngle(
        //     centerPoint, 
        //     rightPoint, 
        //     anglePoint, 
        //     50, true, 'transparent', true);
        displayPath.setAttribute('stroke-width', '2px')

        this.reset = () => {

            this.rotationTex.setOpacity(1)

            this.clear()

            this.wait(3)

            this.play([
                rotationTex2.animate.setOpacity(1),
                this.rotationTex.animate.setOpacity(0),
                braceLabelGroup.animate.setOpacity(1)
            ], 1)

            this.wait()

            // this.play([
            //     t.animate.setValue(1),
            //     q2Tex.animate.setOpacity(1),
            //     cdotQ1Tex.animate.setOpacity(1)
            // ], 3)

            // this.wait(4);

            // this.play([
            //     t.animate.setValue(2),
            //     q2TexDouble.animate.setOpacity(1),
            //     q2Tex.animate.setOpacity(0),
            //     cdotQ1Tex.animate.alignParts(q2TexDouble, '\\cdot q_1')
            // ], 3)

            // this.wait(9);

            // this.play([
            //     t.animate.setValue(0.5),
            //     q2TexHalf.animate.setOpacity(1),
            //     q2TexDouble.animate.setOpacity(0),
            // ], 3)
            
            // this.wait(10);
            
            // this.play([
            //     t.animate.setValue(0),
            //     q2InterpolateTex.animate.setOpacity(1),
            //     q2TexHalf.animate.setOpacity(0),
            //     cdotQ1Tex.animate.shift(-4, 0)

            // ], 1.5)

            // this.play([
            //     tValueTex.animate.setOpacity(1),
            // ], 1)


            // this.wait(6);


            // this.play([
            //     t.animate.setValue(1),

            // ], 13)

            // this.wait()

            // // this.play([
            // //     cdotQ1Tex.animate.setOpacity(0),
            // //     q2InterpolateTex.animate.setOpacityOfParts('\\cdot q_1', 1),
            // // ], 1)

            // // this.play([
            // //     q2InterpolateTex.animate.moveTo(this.frame.width / 2, this.frame.height / 2),
            // //     tValueTex.animate.moveTo(this.frame.width / 2, this.frame.height / 2 + spacing),
            // //     angleTex.animate.setOpacity(0),
            // //     this.rotationTex.animate.setOpacity(0),
            // //     rotationTex2.animate.setOpacity(1),
            // //     displayPath.animate.setOpacity(0)
            // // ], 1)

            // // this.wait()


        }

        this.reset();

    }

    displayAngle(p0: Point, p1: Point, p2: Point, r = 24, fullRotation = true, color = 'var(--font-color)', arcOnly = false): Path {

        let path = this.frame.path('');

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

        let g = this.frame.group();
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