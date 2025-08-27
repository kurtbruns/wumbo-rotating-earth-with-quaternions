import { interpolateColor, Line, Quaternion, Tex, Value, Vector3 } from '@kurtbruns/vector';
import { TransformScene } from "./TransformScene";

export class TransformDiagonalRotationSplitLeft extends TransformScene {

    constructor() {
        super();
        
        // Add text labels for the transformation formulas
        let f1 = this.viewPort.frame.tex('f(p) = q \\cdot p').alignCenter();
        f1.setAttribute('font-size', '18px');
        f1.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50)

        let f2 = this.viewPort.frame.tex('f(p) = q \\cdot p \\cdot q^{-1}').alignCenter();
        f2.setAttribute('font-size', '18px');
        f2.setOpacity(0);
        f2.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50)

        Tex.alignBy(f2, f1, 'f(p) = q \\cdot p');

        // Use Math.PI/3 angle like DiagonalRotationCubeSplit
        let angle = Math.PI/3;
        let sineOfAngle = Math.sin(angle);
        let axis = new Vector3(1, 1, 1).normalize();

        let theta = new Value(Math.PI/3);
        this.left.addDependency(theta);
        this.left.update = () => {
            let sineOfTheta = Math.sin(theta.value);
            this.left.w = Math.cos(theta.value);
            this.left.x = axis.x * sineOfTheta;
            this.left.y = axis.y * sineOfTheta;
            this.left.z = axis.z * sineOfTheta;
        }
        this.left.update();

        let thetaTex = this.viewPort.frame.tex('');
        thetaTex.setAttribute('font-size', '18px');
        thetaTex.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 85)
        thetaTex.addDependency(theta);
        thetaTex.update = () => {
            thetaTex.replace('\\theta = ' + theta.value.toFixed(2));
        }
        thetaTex.update()
        thetaTex.alignCenter();
        Tex.alignHorizontallyBy(thetaTex, f1, '=');
        
        this.reset = () => {
            theta.set(0);
            this.clear();

            this.wait()

            this.play([
                theta.animate.setValue(Math.PI/3),
            ], 5, "linear")

            this.wait()
        }
        this.reset();
    }
} 