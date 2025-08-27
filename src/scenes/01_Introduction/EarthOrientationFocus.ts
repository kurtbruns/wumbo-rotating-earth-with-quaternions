import { Quaternion, Vector3 } from "../../vector/src";
import { EarthScene } from "../EarthScene";
import { EarthOrientationUtils } from "../EarthOrientationUtils";


export class EarthOrientationFocus extends EarthScene {
    constructor() {

        super({
            cameraPosition: new Vector3(0, 0, -3.6),
            drawIJK:false,
            showQuaternionTex: false,
            drawTriangleMesh: true
            
        });

        let latLongs = EarthOrientationUtils.latLongs;

        const quaternionBetween = (start, end) => {

            const cross = start.cross(end);
            const dot = start.dot(end);

            // Calculate the quaternion components
            const w = Math.sqrt(start.length() * end.length()) + dot;
            const x = cross.x;
            const y = cross.y;
            const z = cross.z;

            // Create and normalize the quaternion
            return new Quaternion(w, x, y, z).normalize();
        }


        let radians = (n: number) => {
            return EarthOrientationUtils.radians(n);
        }

        let states: Quaternion[] = [
            Quaternion.fromEulerAngles(radians(-90), 0, 180),
            Quaternion.fromEulerAngles(0, radians(-45), radians(90)),
            Quaternion.fromEulerAngles(0, 0, 0),
            Quaternion.fromEulerAngles(radians(180), 0, radians(180)),
        ]

        // this.q.set(states[0])

        this.reset = () => {

            this.clear();

            let copy = this.q.copy();
            let q = quaternionBetween(this.q.transform(new Vector3(0, 0, 1)), new Vector3(0, 1, 0));

            let coords = latLongs['Broom Bridge'];
            let lat = coords[0];
            let long = coords[1];

            // q = q.multiply(Quaternion.fromAxisAngle(new Vector3(1, 0, 0), lat * Math.PI / 180 - Math.PI / 2));
            // q = q.multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), - long * Math.PI / 180 - Math.PI / 2));


            let dest = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), -Math.PI - long * Math.PI / 180);
            dest = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2 + lat * Math.PI / 180).multiply(dest)

            let r1 = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), -Math.PI / 2 - long * Math.PI / 180);
            let r2 = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2 + lat * Math.PI / 180);

            // let coordinate = new Vector3(1, 0, 0);
            // coordinate.set(dest.transform(coordinate));
            // this.vector(this.origin, coordinate);

            // for(let i = 0; i < 10; i++) {
            //     this.q.set(states[0])
            //     this.play([
            //         this.q.animate.deCasteljau(states)
            //     ], 4)
            // }

            this.play([
                this.q.animate.slerp(dest),
                // this.camera.position.animate.moveTo(new Vector3(0, 0, -4))
            ], Math.acos(q.w)*10 + 1.5)
            
            // this.wait(2)

        }
        this.reset();




    }


}