import { Circle, Group, interpolateColor, Line, Quaternion, Scene3D, Shape, StringValue, Value, Vector2, Vector3 } from '@kurtbruns/vector';
import { LEFT_Q_VALUE } from "../07_AnimateEarth/QuaternionValues";
import { SphereScene } from "../SphereScene";

export class QuaternionConclusion extends SphereScene {

    constructor() {
        super({
        });
        
        // let qValue = new Quaternion(-0.67, -0.51, 0.13, 0.52).normalize();

        let qValue = LEFT_Q_VALUE;

        this.q.set(Quaternion.identity());

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
        console.log(axis)

        this.reset = () => {

            this.q.set(qValue)
            this.q.set(Quaternion.identity())

            let q1 = this.q.copy();
            axis.setOpacity(0)

            this.clear()

            this.play([
                axis.animate.setOpacity(1)
            ])

            this.play([
                this.q.animate.slerp(qValue, false)
            ], 5)

            this.wait();

            this.play([
                this.basisVectors.animate.setOpacity(0),
                this.sphereCircles.animate.setOpacity(0),
                axis.animate.setOpacity(0),
                this.displayTex.animate.setOpacity(0),
            ], 1)


        }

        this.reset();

    }







}