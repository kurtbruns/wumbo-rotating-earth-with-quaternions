import { Circle, Group, interpolateColor, Line, Path, Point, Quaternion, Scene3D, Shape, StringValue, Tex, Value, Vector2, Vector3 } from "../../vector/src";
import { SphereOrientationSideBySide } from "../SphereOrientationSideBySide";
import { LEFT_Q_VALUE, RIGHT_Q_VALUE } from "./QuaternionValues";

export class QuaternionSLERP extends SphereOrientationSideBySide {

    constructor() {

        // let initialQ = new Quaternion(-0.1855, 0.3381, 0.3258, 0.8632).normalize();

        let leftQ = LEFT_Q_VALUE;
        let rightQ = RIGHT_Q_VALUE;
        
        super({
            leftQ: leftQ.copy(),
            rightQ: rightQ.copy(),
            drawRotationAxes: true,
        });

        let xShift = 0
        let spacing = 50

        this.leftSphere.displayTex.setAttribute('opacity', '0')

        let t = new Value(0);

        let q_copy = this.leftSphere.q.copy();
        let r = this.rightSphere.q.multiply(this.leftSphere.q.conjugate());
        this.leftSphere.q.addDependency(r, t, q_copy)
        this.leftSphere.q.update = () => {
            this.leftSphere.q.set(r.pow(t.value).multiply(q_copy));
        }
        this.leftSphere.q.update();

        let startQTex = this.left.plot.tex(`q_1 = ${this.leftSphere.q.toFormattedString()}`);
        startQTex.setAttribute('font-size', '18px');
        startQTex.setAttribute('color', interpolateColor('var(--font-color)', 'var(--background)', 0.5));
        startQTex.moveTo(this.frame.width / 5 - xShift, 150);
        startQTex.drawBackground(true, 'var(--background)', 4)
        startQTex.alignCenter();
        startQTex.alignTo(this.leftSphere.displayTex, '=')

        let calculatedQTex = this.left.plot.tex(`q = ${this.leftSphere.q.toFormattedString()}`);
        calculatedQTex.setAttribute('font-size', '18px');
        calculatedQTex.moveTo(this.frame.width / 5 - xShift, 150);
        calculatedQTex.drawBackground(true, 'var(--background)', 4)
        calculatedQTex.alignCenter();
        calculatedQTex.alignTo(this.leftSphere.displayTex, '=')
        calculatedQTex.shift(0, 36)
        calculatedQTex.addDependency(this.leftSphere.q)
        calculatedQTex.update = () => {
            calculatedQTex.replace(`q = ${this.leftSphere.q.toFormattedString()}`);
        }
        calculatedQTex.update();

        let slerpTex = this.frame.tex(`q = \\left( q_2 \\cdot q_1^{-1} \\right)^t \\cdot q_1`);
        slerpTex.setAttribute('font-size', '18px');
        slerpTex.moveTo(this.frame.width / 2 - xShift, 150);
        slerpTex.drawBackground(true, 'var(--background)', 4)
        slerpTex.alignCenter();        

        let tStartValueTex = this.frame.tex(`t = 0`);
        tStartValueTex.setAttribute('font-size', '18px');
        tStartValueTex.moveTo(this.frame.width / 2 - xShift, 3*spacing);
        tStartValueTex.alignCenter();

        let tEndValueTex = this.frame.tex(`t = 1`);
        tEndValueTex.setAttribute('font-size', '18px');
        tEndValueTex.moveTo(this.frame.width / 2 - xShift, 3*spacing);
        tEndValueTex.alignCenter();

        let tValueTex = this.frame.tex(`t = 0`);
        tValueTex.setAttribute('font-size', '20px');
        tValueTex.moveTo(this.frame.width / 2, this.frame.height / 2);
        tValueTex.alignCenter();
        tValueTex.addDependency(t)
        tValueTex.update = () => {
            tValueTex.replace(`t = ${t.value.toFixed(2)}`);
            tValueTex.drawBackground(true, 'var(--background)', 4)
        }
        tValueTex.update();

        tStartValueTex.alignTo(tValueTex, '=')
        tEndValueTex.alignTo(tValueTex, '=')

        let slerpEquationTex1 = this.frame.tex(`\\operatorname{slerp}\\left(q_1, q_2 ; t\\right)=\\left(q_2 \\cdot q_1^{-1}\\right)^t \\cdot q_1`);
        slerpEquationTex1.setAttribute('font-size', '18px');
        slerpEquationTex1.moveTo(this.frame.width / 2, this.frame.height - 125);
        slerpEquationTex1.alignCenter();
        slerpEquationTex1.setAttribute('opacity', '0')


        let slerpEquationTex2 = this.frame.tex(`\\operatorname{slerp}\\left(q_1, q_2 ; t\\right)=\\frac{\\sin \\left((1-t) \\theta\\right)}{\\sin \\left(\\theta\\right)} q_1+\\frac{\\sin \\left(t \\theta\\right)}{\\sin \\left(\\theta\\right)} q_2`);
        slerpEquationTex2.setAttribute('font-size', '18px');
        slerpEquationTex2.moveTo(this.frame.width / 2, this.frame.height - 50);
        slerpEquationTex2.alignCenter();
        slerpEquationTex2.alignHorizontallyTo(slerpEquationTex1, '=')
        slerpEquationTex2.setAttribute('opacity', '0')




        this.drawPathArrow();
        this.pathArrow.setAttribute('opacity', '1')

        this.reset = () => {

            this.clear()

            this.wait()

            this.play([
                t.animate.setValue(1),
            ], 5)

            this.wait()

            this.play([
                t.animate.setValue(0),
            ], 3)

            this.play([
                calculatedQTex.animate.setOpacity(0),
                startQTex.animate.setOpacity(0),
                this.leftSphere.displayTex.animate.setOpacity(1),
            ])

            this.wait()

            this.play([
                slerpEquationTex1.animate.setOpacity(1),
            ], 1)

            this.wait(12)


            this.play([
                slerpEquationTex2.animate.setOpacity(1),
            ], 1)

            this.wait(1);


        }

        this.reset();

    }

}