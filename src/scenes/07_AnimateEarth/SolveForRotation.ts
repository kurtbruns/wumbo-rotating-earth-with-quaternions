import { Quaternion, Tex } from '@kurtbruns/vector';
import { SphereOrientationSideBySide } from "../SphereOrientationSideBySide";
import { LEFT_Q_VALUE, RIGHT_Q_VALUE } from "./QuaternionValues";

export class SolveForRotation extends SphereOrientationSideBySide {
    constructor() {

        let leftQ = LEFT_Q_VALUE;
        let rightQ = RIGHT_Q_VALUE;

        super({
            leftQ: leftQ.copy(),
            rightQ: rightQ.copy(),
            drawRotationAxes: true,
        });

        let equation = this.frame.tex('r \\cdot q_1 = q_2');
        equation.setAttribute('font-size', '20px');
        equation.moveTo(this.frame.width / 2, 150);
        equation.alignCenter();
        equation.drawBackground(true, 'var(--background)', 8)
        // equation.setAttribute('opacity', '0')

        let equation2 = this.frame.tex('r = q_2 \\cdot q_1^{-1}');
        equation2.setAttribute('font-size', '20px');
        equation2.moveTo(this.frame.width / 2, 150);
        equation2.alignCenter();
        equation2.drawBackground(true, 'var(--background)', 3)
        equation2.setAttribute('opacity', '0')

        Tex.alignHorizontallyBy(equation, equation2, '=')

        this.rotationTex.setAttribute('opacity', '1')

        this.drawPathArrow();
        this.pathArrow.setAttribute('opacity', '1')
        // this.positiveAxis.setAttribute('opacity', '1')
        

        this.reset = () => {
            this.clear();

            this.wait()

            this.play([
                equation.animate.shift(0, -50),
            ], 1)

            this.play([
                equation2.animate.setOpacity(1)
            ], 1)

            this.wait(1)


        };

        this.reset();
    }
}
