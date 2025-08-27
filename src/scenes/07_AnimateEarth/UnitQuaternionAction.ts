import { Quaternion } from '@kurtbruns/vector';
import { SphereOrientationSideBySide } from "../SphereOrientationSideBySide";
import { LEFT_Q_VALUE, RIGHT_Q_VALUE } from "./QuaternionValues";

export class UnitQuaternionAction extends SphereOrientationSideBySide {
    constructor() {

        let leftQ = LEFT_Q_VALUE;
        let rightQ = RIGHT_Q_VALUE;

        super({
            leftQ: Quaternion.identity(),
            rightQ: rightQ.copy(),
            drawRotationAxes: false,
        });

        let equation = this.frame.tex('r \\cdot q_1 = q_2');
        equation.setAttribute('font-size', '20px');
        equation.moveTo(this.frame.width / 2, 150);
        equation.alignCenter();
        equation.drawBackground(true, 'var(--background)', 3)
        equation.setAttribute('opacity', '1')

        this.rotationTex.setAttribute('opacity', '1')

        this.drawPathArrow();

        this.pathArrow.setAttribute('opacity', '1')


        this.reset = () => {
            this.clear();

            this.wait()

            this.play([
                this.leftSphere.q.animate.slerp(RIGHT_Q_VALUE, false),
            ], 6);

            this.wait(2);

        };

        this.reset();
    }
}
