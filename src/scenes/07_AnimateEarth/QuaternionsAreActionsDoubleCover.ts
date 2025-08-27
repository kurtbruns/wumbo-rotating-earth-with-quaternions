import { Quaternion, Vector3 } from '@kurtbruns/vector';
import { SphereOrientationSideBySide } from "../SphereOrientationSideBySide";

export class QuaternionsAreActionsDoubleCover extends SphereOrientationSideBySide {
    constructor() {
        super({
            leftQ: Quaternion.identity(),
            rightQ: new Quaternion(0.88, 0.14, -0.17, 0.41).normalize(),
            drawRotationAxes: true,
            drawRightRotationAxes: true,
            positiveColor: 'var(--pink)',
            negativeColor: 'var(--pink)',
        });

        let axis = new Vector3(0.14, -0.17, 0.41).normalize();
        let angle = Math.PI;
        let r = Quaternion.fromAxisAngle(axis, angle);

        let rCopy = this.rightSphere.q.copy()

        this.positiveAxisRight.setAttribute('opacity', '0');


        this.reset = () => {

            this.clear();

            this.play([
                this.positiveAxisRight.animate.setOpacity(1),
            ], 3);

            // rotate right 
            this.play([
                this.rightSphere.q.animate.rotateBy(r),
            ], 3, "easeIn");

            this.play([
                this.rightSphere.q.animate.rotateBy(r),
            ], 3, "easeOut");

        };
    }
}
