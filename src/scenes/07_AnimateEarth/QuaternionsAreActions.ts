import { Quaternion } from '@kurtbruns/vector';
import { SphereOrientationSideBySide } from "../SphereOrientationSideBySide";

export class QuaternionsAreActions extends SphereOrientationSideBySide {
    constructor() {
        super({
            leftQ: Quaternion.identity(),
            rightQ: new Quaternion(0.88, 0.14, -0.17, 0.41).normalize(),
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
