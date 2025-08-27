import { Quaternion } from "../../vector/src";
import { SphereOrientationSideBySide } from "../SphereOrientationSideBySide";
import { LEFT_Q_VALUE, RIGHT_Q_VALUE } from "./QuaternionValues";

export class InterpolateBetweenTwoOrientations extends SphereOrientationSideBySide {
    constructor() {

        let leftQ = LEFT_Q_VALUE;
        let rightQ = RIGHT_Q_VALUE;

        super({
            leftQ: leftQ.copy(),
            rightQ: rightQ.copy(),
            drawRotationAxes: false,
        });

        let duration = Math.acos(this.rightSphere.q.multiply(this.leftSphere.q.conjugate()).w) * 3 + 4.5;

        this.reset = () => {
            this.clear();

            this.wait()

            // Animate from identity to the target quaternion
            this.play([
                this.leftSphere.q.animate.slerp(this.rightSphere.q, false),
                this.rotationTex.animate.setOpacity(1),
            ], duration);

            this.wait(4);

            // this.play([
            //     this.leftSphere.q.animate.slerp(LEFT_Q_VALUE, false),
            // ], 2);

            // this.wait()
        };

        this.reset();
    }
}
