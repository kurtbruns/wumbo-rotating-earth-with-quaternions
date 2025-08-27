import { Quaternion, Vector3 } from "../../vector/src";
import { EulerOrder } from "../../vector/src/quaternions/Quaternion";
import { EarthScene } from "../EarthScene";


export class QuaternionInterpolation extends EarthScene {
    constructor() {

        super({
            cameraPosition: new Vector3(0, 0, -3.6),
            drawIJK: false,
            showQuaternionTex: false,
            drawTriangleMesh: true,

        });

        // this.foreground.circle(this.viewPort.width/2, this.viewPort.height/2, 3)
        // .setAttribute('fill', 'var(--font-color)')

        // let sphere = this.drawSphere(1, 0.5, false, 'var(--earth-blue)')
        // this.foreground.appendChild(sphere);

        let radians = (degrees:number) => {
            return degrees*Math.PI/180;
        }

        let alpha = 45;
        let beta = 45;
        let gamma = 0;

        let order = EulerOrder.ZYX;

        let q0 = Quaternion.fromEulerAngles(radians(alpha), radians(beta), radians(gamma), order);
        let q1 = Quaternion.fromEulerAngles(radians(alpha - 180), radians(beta), radians(gamma + 180), order);

        this.reset = () => {

            this.clear();
            this.q.set(q0);

            this.wait(2)

            this.play([
                this.q.animate.slerp(q1)
            ], 6, 'linear')

            this.wait(2)

        }
        this.reset();




    }


}