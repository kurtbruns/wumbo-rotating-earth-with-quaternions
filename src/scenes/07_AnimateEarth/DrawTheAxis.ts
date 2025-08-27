import { Quaternion } from "../../vector/src";
import { SphereOrientationSideBySide } from "../SphereOrientationSideBySide";
import { RIGHT_Q_VALUE } from "../07_AnimateEarth/QuaternionValues";

export class DrawTheAxis extends SphereOrientationSideBySide {
    constructor() {

        let leftQ = new Quaternion(0.88, 0.14, -0.17, 0.41).normalize();
        let rightQ = RIGHT_Q_VALUE;
        super({
            leftQ: leftQ.copy(),
            rightQ: rightQ.copy(),
            drawRotationAxes: true,
        });

        this.reset = () => {
            this.clear();

            // Animate from identity to the target quaternion
            this.play([
                this.leftSphere.q.animate.slerp(this.rightSphere.q, false),
            ], Math.acos(this.rightSphere.q.multiply(this.leftSphere.q.conjugate()).w) * 3 + 1.5);
        };
    }
}
