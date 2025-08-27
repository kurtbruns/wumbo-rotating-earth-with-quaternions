import { Circle, Group, interpolateColor, Line, Quaternion, Scene3D, Shape, StringValue, Value, Vector2, Vector3 } from '@kurtbruns/vector';
import { SphereScene } from "../SphereScene";

export class AxisOfRotationShortestPath extends SphereScene {

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

        // let activeAxis = this.drawQuaternionAxis(this.q, true);
        let axis = this.drawQuaternionAxis(b, true, "var(--font-color)");

        this.reset = () => {

            let q1 = this.q.copy();

            this.clear()

            this.play([
                axis.animate.setOpacity(1)
            ])

            this.play([
                this.q.animate.slerp(Quaternion.identity(), false)
            ], 3)

            this.wait();

            this.play([
                this.q.animate.slerp(q1, true)
            ], 3)

            this.wait();

            // this.play([
            //     this.q.animate.slerp(Quaternion.identity(), false)
            // ], 3)

            // this.wait();


            // this.play([
            //     axis.animate.setOpacity(0)
            // ])


        }

    }







}