import { interpolateColor, Line, Quaternion, Tex, Value, Vector3 } from "../../vector/src";
import { TransformScene } from "./TransformScene";

export class TransformDiagonalRotationSplitTheta extends TransformScene {

    constructor() {
        super();
        
        // Add text labels for the transformation formulas
        let f1 = this.viewPort.frame.tex('f(p) = q \\cdot p').alignCenter();
        f1.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50)

        let f2 = this.viewPort.frame.tex('f(p) = q \\cdot p \\cdot q^{-1}').alignCenter();
        f2.setOpacity(0);
        f2.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50)

        Tex.alignBy(f2, f1, 'f(p) = q \\cdot p');

        // Use Math.PI/3 angle like DiagonalRotationCubeSplit
        let leftAngle = new Value(0);
        let rightAngle = new Value(0);
        let scaleLeft = new Value(1);
        let scaleRight = new Value(1);
        let axis = new Vector3(1, 1, 1).normalize();
        let scale = 1.5;

        let thetaAsNumber = false;
        this.qTex.update = () => {
        
            let thetaValue = Math.acos(this.left.w);
            // If x is negative, we need to add π to get the correct angle in [0, 2π]
            if (this.left.x < 0) {
                thetaValue = 2 * Math.PI - thetaValue;
            }

            let thetaString = thetaAsNumber ? thetaValue.toFixed(2) : '\\theta';

            this.qTex.replace(`q= ${scale} \\left( \\cos (${thetaString})+\\sin (${thetaString}) \\frac{(1 i+1 j+1 k)}{\\sqrt{3}} \\right) `);
            this.qTex.setColorAll(thetaString, '#72D6BF');
            this.qTex.setColorAll(' \\frac{(1 i+1 j+1 k)}{\\sqrt{3}}', 'var(--pink)');
            this.qTex.alignCenter();
        }
        this.qTex.update();


        let l = Quaternion.identity();
        l.addDependency(leftAngle, scaleLeft);
        l.update = () => {
            let sineOfAngle = Math.sin(leftAngle.value);
            l.set(new Quaternion(
                Math.cos(leftAngle.value),
                axis.x * sineOfAngle,
                axis.y * sineOfAngle,
                axis.z * sineOfAngle
            ).scale(scaleLeft.value));
        }
        l.update();


        let r = Quaternion.identity();
        r.addDependency(rightAngle, scaleRight);
        r.update = () => {
            let sineOfAngle = Math.sin(rightAngle.value);
            r.set(new Quaternion(
                Math.cos(rightAngle.value),
                axis.x * sineOfAngle,
                axis.y * sineOfAngle,
                axis.z * sineOfAngle
            ).scale(scaleRight.value));
        }
        r.update();

        this.left.addDependency(l);
        this.left.update = () => {
            this.left.set(l);
        }
        this.right.addDependency(r);
        this.right.update = () => {
            this.right.set(r);
        }

        // Override the reset method to implement the split animation behavior
        this.reset = () => {
            this.clear();

            this.play([
                leftAngle.animate.setValue(Math.PI/3),
                scaleLeft.animate.setValue(2),
            ], 5, "linear")

            this.wait(1)

            this.play([
                rightAngle.animate.setValue(Math.PI/3),
                scaleRight.animate.setValue(2),
                f2.animate.setOpacity(1),
            ], 5, "linear")
    
        }
        this.reset();
    }
} 