import { Group, Quaternion, Tex, Vector3 } from "../../vector/src";
import { SphereSceneSplit } from "./SphereSceneSplit";


export class VisualizeTwoRotationsDiagonalAxis extends SphereSceneSplit {

    constructor() {
        super();

        let f1 = this.viewPort.frame.tex('f(p) = q \\cdot p').alignCenter();
        // f1.setOpacity(0);
        f1.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 100)

        let f2 = this.viewPort.frame.tex('f(p) = q \\cdot p \\cdot q^{-1}').alignCenter();
        f2.setOpacity(0);
        f2.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 100)

        Tex.alignBy(f2, f1, 'f(p) = q \\cdot p');

        let theta = - Math.PI / 2 ;
        let axis = new Vector3(1, 1, 1).normalize();
        let r = Quaternion.fromAxisAngle(axis, 2*theta);
        // this.q.set(r)

        let arrow = this.drawConeArrow(axis.scale(1.5), "var(--pink)", 0.1);

        for (let i = 0; i < 4; i++) {
            this.play([
                this.left.animate.rotateBy(r),
                f1.animate.setOpacity(1),
            ], 5, "linear")
        }

        // this.wait(2)



        // this.play([
        //     f1.animate.alignParts(f2, 'f(p) = q \\cdot p'),
        // ])

        // this.play([
        //     this.right.animate.rotateBy(r),
        //     f1.animate.setOpacity(0),
        //     f2.animate.setOpacity(1),
        // ], 5)

        // this.wait(2)

        // this.play([
        //     this.left.animate.slerp(Quaternion.identity()),
        //     this.right.animate.slerp(Quaternion.identity()),
        // ], 2)

        // this.wait(2)

        // this.play([
        //     this.left.animate.rotateBy(r),
        //     this.right.animate.rotateBy(r),
        // ], 5)
    }

}