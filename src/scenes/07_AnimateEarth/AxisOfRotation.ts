import { Circle, Group, interpolateColor, Line, Quaternion, Scene3D, Shape, StringValue, Value, Vector2, Vector3 } from "../../vector/src";
import { SphereScene } from "../SphereScene";

export class AxisOfRotation extends SphereScene {

    constructor() {
        super();

        this.q.set(new Quaternion(-0.67, -0.51, 0.13, 0.52).normalize());

        let q0 = Quaternion.identity();
        (window as any).save = () => {
            q0.set(this.q);
        }

        let b = new Quaternion();
        b.addDependency(q0, this.q);
        b.update = () => {
            b.set(this.q.multiply(q0.conjugate()));
        }
        b.update();

        let axis = this.drawQuaternionAxis(b, true, "var(--font-color)");

        this.reset = () => {

            let q1 = this.q.copy();

            this.clear()

            this.play([
                axis.animate.setOpacity(1)
            ])

            this.play([
                this.q.animate.slerp(q0, false)
            ], 3)

            this.wait();

            this.play([
                this.q.animate.slerp(q1, false)
            ], 3)

            // this.play([
            //     axis.animate.setOpacity(0)
            // ])


        }

    }







}