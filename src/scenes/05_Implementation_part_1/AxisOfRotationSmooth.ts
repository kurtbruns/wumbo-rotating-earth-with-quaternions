import { Quaternion, Vector3 } from "../../vector/src";
import { SphereScene } from "../SphereScene";

export class AxisOfRotationSmooth extends SphereScene {

    constructor() {
        super();

        let xRotation = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), Math.PI/2);
        let yRotation = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI/2);
        let zRotation = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI/2);

        let q0 = Quaternion.identity();
        let q1 = xRotation.multiply(q0);
        let q2 = yRotation.multiply(q1);
        let q3 = zRotation.multiply(q2);

        this.play([
            this.q.animate.slerp(q1, false)
        ], 3)

        this.wait();

        this.play([
            this.q.animate.slerp(q2, false)
        ], 3)

        this.wait();

        this.play([
            this.q.animate.slerp(q3, false)
        ], 3)



    }







}