import { interpolateColor, Line, Quaternion, Tex, Vector3 } from '@kurtbruns/vector';
import { TransformScene } from "./TransformScene";

export class TransformDiagonalRotationSplitConjugate extends TransformScene {

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
        let angle = Math.PI/3;
        let sineOfAngle = Math.sin(angle);
        let axis = new Vector3(1, 1, 1).normalize();
        
        let r = new Quaternion(
            Math.cos(angle),
            axis.x * sineOfAngle,
            axis.y * sineOfAngle,
            axis.z * sineOfAngle
        );

        // Override the reset method to implement the split animation behavior
        this.reset = () => {
            this.clear();

            this.play([
                this.right.animate.rotateBy(r, false),
            ], 5, "linear")

        }
        this.reset();
    }

    initializeBasisVectors() {
        // Create basis vectors
        let one = new Quaternion(1, 0, 0, 0);
        this.i = new Quaternion(0, 1, 0, 0);
        this.j = new Quaternion(0, 0, 1, 0);
        this.k = new Quaternion(0, 0, 0, 1);

        // Orient them using the orientQ method
        this.orientQ(one);
        this.orientQ(this.i);
        this.orientQ(this.j);
        this.orientQ(this.k);

        // Draw them as vectors
        this.vectorQ(one, 'var(--yellow)', 1);
        this.vectorQ(this.i, 'var(--red)', 1);
        this.vectorQ(this.j, 'var(--green)', 1);
        this.vectorQ(this.k, 'var(--blue)', 1);
    }
} 