import { Quaternion } from '@kurtbruns/vector';
import { SphereOrientationSideBySide } from "../SphereOrientationSideBySide";
import { LEFT_Q_VALUE, RIGHT_Q_VALUE } from "./QuaternionValues";

export class ModelWithEquation extends SphereOrientationSideBySide {
    constructor() {

        let leftQ = LEFT_Q_VALUE;
        let rightQ = RIGHT_Q_VALUE;

        super({
            leftQ: leftQ.copy(),
            rightQ: rightQ.copy(),
            drawRotationAxes: false,
        });

        let equation = this.frame.tex('r \\cdot q_1 = q_2');
        equation.setAttribute('font-size', '20px');
        equation.moveTo(this.frame.width / 2, 150);
        equation.alignCenter();
        equation.drawBackground(true, 'var(--background)', 3)
        equation.setAttribute('opacity', '0')

        this.rotationTex.setAttribute('opacity', '1')

        this.drawPathArrow();

        let duration = Math.acos(this.rightSphere.q.multiply(this.leftSphere.q.conjugate()).w) * 3 + 4.5;

        this.reset = () => {
            this.clear();

            this.wait()

            this.play([
                equation.animate.setOpacity(1),
            ], 1);

            this.wait(4.5);

            this.play([
                this.pathArrow.animate.setOpacity(1),
            ], 1);

            this.wait(12)

            this.play([
                this.leftSphere.q.animate.slerp(Quaternion.identity(), false),
            ], 2);

            this.wait(2);

        };

        this.reset();
    }
}
