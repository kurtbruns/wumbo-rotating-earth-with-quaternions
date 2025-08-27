import { Circle, Group, interpolateColor, Line, Quaternion, Scene3D, Shape, StringValue, Value, Vector2, Vector3 } from "../../vector/src";
import { SphereScene } from "../SphereScene";

export class AxisOfRotationBetweenQuaternions extends SphereScene {

    constructor() {
        super();

        let v = new Quaternion(0.88, 0.14, -0.17, 0.41).normalize();
        let w = new Quaternion(0.37, 0.24, -0.37, -0.82).normalize();


        // this.q.set(new Quaternion(-0.67, -0.51, 0.13, 0.52).normalize());
        this.q.set(v);

        let aNeg = new Vector3();
        aNeg.addDependency(this.q, w);
        aNeg.update = () => {
            let temp = w.multiply(this.q.conjugate()).toVector3();
            if( temp.length() > 0.00001 ){
                aNeg.set(temp.negate());
            }
        }
        aNeg.update();

        let a = new Vector3();
        a.addDependency(this.q, w);
        a.update = () => {
            let temp = w.multiply(this.q.conjugate()).toVector3();
            if( temp.length() > 0.00001 ){
                a.set(temp);
            }
        }
        a.update();

        

        let t1 = this.drawVectorOnSphere(a, 1, 1.4, "var(--purple)")
        let t2 = this.drawVectorOnSphere(aNeg, 1, 1.4, "var(--orange)")


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

        // let axis = this.drawQuaternionAxis(b, true, "var(--font-color)");

        this.reset = () => {

            let q1 = this.q.copy();

            this.clear()

            // this.play([
            //     axis.animate.setOpacity(1)
            // ])

            this.play([
                this.q.animate.slerp(w, false)
            ], 3)

            this.wait();

            this.play([
                this.q.animate.slerp(q1, false)
            ], 3)

            this.wait();

            // this.play([
            //     this.q.animate.slerp(q1, false)
            // ], 3)

            // this.play([
            //     axis.animate.setOpacity(0)
            // ])


        }

    }







}