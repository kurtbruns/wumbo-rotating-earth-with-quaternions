import { interpolateColor, Line, Quaternion, Tex, Vector3 } from "../../vector/src";
import { TransformScene } from "./TransformScene";

export class TransformDiagonalRotationSplitXAxis extends TransformScene {

    constructor() {
        super();
        
        // Add text labels for the transformation formulas
        let f1 = this.viewPort.frame.tex('f(p) = q \\cdot p').alignCenter();
        f1.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50)

        let f2 = this.viewPort.frame.tex('f(p) = q \\cdot p \\cdot q^{-1}').alignCenter();
        f2.setOpacity(0);
        f2.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50)

        Tex.alignBy(f2, f1, 'f(p) = q \\cdot p');

        let angle = Math.PI/3;
        let sineOfAngle = Math.sin(angle);
    
        let r = new Quaternion(
            Math.cos(angle),
            this.axis.x * sineOfAngle,
            this.axis.y * sineOfAngle,
            this.axis.z * sineOfAngle
        );
        r.addDependency(this.axis);
        r.update = () => {
            r.set(new Quaternion(
                Math.cos(angle),
                this.axis.x * sineOfAngle,
                this.axis.y * sineOfAngle,
                this.axis.z * sineOfAngle
            ));
        }
        r.update();

        let a = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI/4);
        // let a = Quaternion.identity();
        let b = Quaternion.fromAxisAngle(new Vector3(-1, 1, 0), Math.acos(1/Math.sqrt(3)));
        
        let c = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI/3);
        
        let q = c.multiply(a.multiply(b));

        this.reset = () => {
            this.clear();

            this.play([
                this.cubeRotation.animate.slerp(Quaternion.identity(), false),
            ], 3)

            this.wait()

            this.play([
                this.left.animate.rotateBy(r, false),
            ], 5)

            this.wait()

            this.play([
                this.right.animate.rotateBy(r, false),
            ], 5)

    
        }
        this.reset();
    }
} 