import { interpolateColor, Line, Quaternion, Tex, Value, Vector3 } from '@kurtbruns/vector';
import { TransformScene } from "./TransformScene";

export class TransformDiagonalRotationSplitRightInverse extends TransformScene {

    constructor() {
        super();
        
        // Add text labels for the transformation formulas
        let f1 = this.viewPort.frame.tex('f(p) = p \\cdot q^{-1}').alignCenter();
        f1.setAttribute('font-size', '18px');
        f1.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50)

        let f2 = this.viewPort.frame.tex('f(p) = p \\cdot q^{-1}').alignCenter();
        f2.setAttribute('font-size', '18px');
        f2.setOpacity(0);
        f2.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50)

        Tex.alignBy(f2, f1, 'f(p) = p \\cdot q^{-1}');

        // Use Math.PI/3 angle like DiagonalRotationCubeSplit
        let angle = Math.PI/3;
        let sineOfAngle = Math.sin(angle);
        let axis = new Vector3(1, 1, 1).normalize();
                
        let theta = new Value(0);
        this.right.addDependency(theta);
        this.right.update = () => {
            let sineOfTheta = Math.sin(theta.value);
            this.right.w = Math.cos(theta.value);
            this.right.x = axis.x * sineOfTheta;
            this.right.y = axis.y * sineOfTheta;
            this.right.z = axis.z * sineOfTheta;
        }
        this.right.update();

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


        // Override the reset method to implement the split animation behavior
        this.reset = () => {
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