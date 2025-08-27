import { Quaternion, Scene3D, Value, Vector2, Vector3 } from '@kurtbruns/vector';
import { EarthScene } from "../EarthScene";


export class EarthSpinRelativeToSun extends EarthScene {
    constructor() {

        let x = Math.sqrt(2)/2;
        super({

            // cameraOrientation: new Quaternion(-0.703, -0.518, 0.289, -0.392), 
            // cameraPosition: new Vector3(3.248, 2.011, 1.185),

            cameraOrientation: new Quaternion(0, 0, x, -x), 
            cameraPosition: new Vector3(0, -4, 0),


            // q: new Quaternion(0.39, -0.27, -0.51, -0.72),
            drawAxes: false,
        });


        this.drawSphere(new Value(1));
        // this.drawSphereOutline();
        // this.drawQuaternionCube(this.q, 1, {opacity: 0.25});

        let p = new Vector3(-23520, 0, 0);
        this.drawPoint(p, {color:'var(--yellow)'})


        // this.q.set(this.q.multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI/3)));

    
        let q0 = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), 23.5/180*Math.PI)
        .multiply(this.q)

        let q1 = q0.multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI));
        let q2 = q1.multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI));

        this.q.set(q0)


        this.play([
            this.q.animate.slerp(q1)
        ], 8, 'easeIn');

        this.play([
            this.q.animate.slerp(q2)
        ], 8, 'easeOut');

        // this.wait();

    }
}