import { Quaternion, Scene3D, Value, Vector2, Vector3 } from '@kurtbruns/vector';
import { EarthScene } from "../EarthScene";


export class EarthOrientationSlerp2 extends EarthScene {
    constructor() {
        super({

            cameraOrientation: new Quaternion(0, 0, 0, -1),
            cameraPosition: new Vector3(0, 0, 4),
            q: new Quaternion(0.39, -0.27, -0.51, -0.72),
        });

        this.drawSphere(new Value(1));
        // this.drawSphereOutline();
        // this.drawQuaternionCube(this.q, 1, {opacity: 0.25});

        const latitudeLongitudeView = (lat:number, long:number) : Quaternion  => {

            let q = this.camera.orientation.inverse();

            q = q.multiply(Quaternion.fromAxisAngle(new Vector3(1, 0, 0), Math.PI/2 - lat*Math.PI/180));
            q = q.multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI/2 - long*Math.PI/180));

            return q;
        }

        let views = {
            'Salt Lake': latitudeLongitudeView(40.7608, -111.8910),
            'Japan': latitudeLongitudeView(36.2048, 138.2529),
            'Australia': latitudeLongitudeView(-25.2744, 133.7751),
            'San Francisco': latitudeLongitudeView(37.7749, -122.4194),
            'Tokyo': latitudeLongitudeView(35.6895, 139.6917),
            'Bangkok': latitudeLongitudeView(13.7563, 100.5018),
            
        }

        let topView = this.camera.orientation.inverse().multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI));

        let frontView = this.camera.orientation.inverse()

        frontView = frontView.multiply(Quaternion.fromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2));

        let rightView = this.camera.orientation.inverse()

        rightView = rightView.multiply(Quaternion.fromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2));
        rightView = rightView.multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2));


        let rotateFrontView1 = frontView.multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI))
        let rotateFrontView2 = rotateFrontView1.multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI))

        this.q.set(latitudeLongitudeView(-30, -90))

        this.wait()

        this.play([
            this.q.animate.slerp(views['Salt Lake'])
        ], 4);

        this.wait();


        // this.q.set(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), -0.35*2*Math.PI).multiply(views['San Francisco']))

        // this.play([
        //     this.q.animate.slerp(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), -0.2*2*Math.PI).multiply(views['Tokyo']))
        // ], 10);

        // this.wait();






        // // this.play([
        // //     this.q.animate.slerp(rightView)
        // // ], 3);

        // // this.wait();

        // this.play([
        //     this.q.animate.slerp(topView)
        // ], 7)

        // this.wait();

        // this.play([
        //     this.q.animate.slerp(new Quaternion(0.39, -0.27, -0.51, -0.72))
        // ], 5);

        // this.wait();



    }


}