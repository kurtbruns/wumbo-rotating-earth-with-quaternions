import { Quaternion, Tex, Value, Vector3 } from '@kurtbruns/vector';
import { TransformScene } from "./TransformScene";

export class TransformDiagonalRotationSplitLeftInverseComplete extends TransformScene {

    constructor() {
        super();
        
        // Add text labels for the transformation formulas
        let f1 = this.viewPort.frame.tex('f(p) = q^{-1} \\cdot p').alignCenter();
        f1.setAttribute('font-size', '18px');
        f1.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50)

        let f2 = this.viewPort.frame.tex('f(p) = \\overline{q} \\cdot p \\cdot q^{-1}').alignCenter();
        f2.setOpacity(0);
        f2.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50)

        Tex.alignBy(f2, f1, 'f(p) = \\overline{q} \\cdot p');
        
        
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

        let theta = new Value(0);

        this.left.addDependency(theta);
        this.left.update = () => {
            let sineOfTheta = Math.sin(theta.value);
            this.left.w = Math.cos(theta.value);
            this.left.x = - axis.x * sineOfTheta;
            this.left.y = - axis.y * sineOfTheta;
            this.left.z = - axis.z * sineOfTheta;
        }

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

        // let a = new Quaternion(0, 1, 1, 1).normalize();
        // this.orientQ(a);
        // let aTex = this.viewPort.frame.tex('a=' + a.toFormattedString()).alignCenter();
        // aTex.addDependency(a);
        // aTex.update = () => {
        //     aTex.replace('a=' + a.toFormattedString());
        //     aTex.alignCenter();
        // }
        // aTex.update();
        // aTex.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 80)

        // this.visualizeVector(a);

        // Override the reset method to implement the split animation behavior
        this.reset = () => {

            theta.set(Math.PI/3);
            this.clear();

            // this.wait()

            // this.play([
            //     this.left.animate.rotateBy(r.conjugate(), false),
            // ], 5, "linear")

            // this.wait()

            this.wait()

            this.play([
                theta.animate.setValue(2*Math.PI - 2*Math.PI/(12*30)),
            ], 12 - 1/30, "linear")

            this.play([
                theta.animate.setValue(0),
            ], 1/30 , "linear")

            this.wait()

        }
        this.reset();
    }

    initializeBasisVectors() {
        // Create basis vectors
        // let one = new Quaternion(1, 0, 0, 0);
        this.i = new Quaternion(0, 1, 0, 0);
        this.j = new Quaternion(0, 0, 1, 0);
        this.k = new Quaternion(0, 0, 0, 1);

        // Orient them using the orientQ method
        // this.orientQ(one);
        this.orientQ(this.i);
        this.orientQ(this.j);
        this.orientQ(this.k);

        // Draw them as vectors
        // this.vectorQ(one, 'var(--yellow)', 1);
        this.vectorQ(this.i, 'var(--red)', 1);
        this.vectorQ(this.j, 'var(--green)', 1);
        this.vectorQ(this.k, 'var(--blue)', 1);
    }
} 