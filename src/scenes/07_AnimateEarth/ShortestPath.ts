import { Quaternion, Vector3 } from "../../vector/src";
import { SphereOrientationSideBySide } from "../SphereOrientationSideBySide";

export class ShortestPath extends SphereOrientationSideBySide {
    constructor() {
        super({
            leftQ: Quaternion.identity(),
            rightQ: Quaternion.fromAxisAngle(new Vector3(1, 1, 1), Math.PI/3),
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
