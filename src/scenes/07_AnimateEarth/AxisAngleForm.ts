import { Quaternion } from '@kurtbruns/vector';
import { SphereOrientationSideBySide } from "../SphereOrientationSideBySide";
import { LEFT_Q_VALUE, RIGHT_Q_VALUE } from "./QuaternionValues";

export class AxisAngleForm extends SphereOrientationSideBySide {
    constructor() {


        let rightQ = RIGHT_Q_VALUE.copy();
        super({
            leftQ: Quaternion.identity(),
            // rightQ: new Quaternion(0.88, 0.14, -0.17, 0.41).normalize(),
            // rightQ: new Quaternion(0.37, 0.24, -0.37, -0.82).negate().normalize(),
            // rightQ: new Quaternion(-0.5044, -0.1681, 0.4026, 0.7451).normalize(),
            rightQ: rightQ.copy(),

            // rightQ: new Quaternion(-0.67, -0.51, 0.13, 0.52).normalize(),
            drawRotationAxes: true,
        });

        let axis = this.rightSphere.q.toVector3().normalize();
        let angle = 2*Math.acos(this.rightSphere.q.w);

        

        let equation = this.frame.tex('r \\cdot q_1 = q_2');
        equation.setAttribute('font-size', '20px');
        equation.moveTo(this.frame.width / 2, 150);
        equation.alignCenter();
        equation.drawBackground(true, 'var(--background)', 3)
        equation.setAttribute('opacity', '1')

        this.drawPathArrow();

        this.pathArrow.setAttribute('opacity', '1')

        this.rotationTex.setOpacity(1)

        this.reset = () => {

            this.positiveAxis.setAttribute('opacity', '0')
            this.clear();

            this.wait()

            this.play([
                this.positiveAxis.animate.setOpacity(1),
            ])

            this.wait(1.5)

            this.play([
                this.rightSphere.q.animate.slerp(new Quaternion(0.1737, -0.6720, 0.1835, 0.6961), false),
            ], 5.5)

            this.wait(2.5);

            this.play([
                this.leftSphere.q.animate.slerp(this.rightSphere.q, false),
            ], Math.acos(this.rightSphere.q.multiply(this.leftSphere.q.conjugate()).w) * 2 + 1.5);

            this.wait(2)

            this.play([
                this.leftSphere.q.animate.slerp(LEFT_Q_VALUE, false),
                this.rightSphere.q.animate.slerp(RIGHT_Q_VALUE, false),
            ], 3)

            this.wait()
        };

        this.reset();
    }
}
