import { Quaternion, Value, Vector3 } from '@kurtbruns/vector';
import { EarthScene } from "../EarthScene";
import { EarthOrientationUtils } from "../EarthOrientationUtils";


export class EarthAmbientlyRotate extends EarthScene {
    constructor() {

        super({
            cameraPosition: new Vector3(0, 0, -4),
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
            return n * Math.PI / 180;
        }

        this.onLoad = () => {

            // Start at Broom Bridge location
            let coords = latLongs['Broom Bridge'];
            let lat = coords[0];
            let long = coords[1];


            let v1 = new Value(-Math.PI - long * Math.PI / 180);
            let v2 = new Value(-Math.PI / 2 + lat * Math.PI / 180);

            // Set initial orientation to Broom Bridge
            let initialOrientation = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), -Math.PI - long * Math.PI / 180);
            initialOrientation = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2 + lat * Math.PI / 180).multiply(initialOrientation);

            this.q.addDependency(v1);
            this.q.addDependency(v2);

            this.q.update = () => {
                let r1 = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), v1.value);
                let r2 = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), v2.value).multiply(r1);
                this.q.set(r2);
            }
            
            this.q.set(initialOrientation);

            let value1 = v1.value - Math.PI/24;
            let value2 = v2.value - Math.PI/144;

            this.play([
                v1.animate.setValue(value1),
                v2.animate.setValue(value2),
            ], 2, "easeIn");

            // Steps 2-7: loop
            for (let i = 0; i < 3; i++) {
                value1 -= Math.PI/2;
                value2 -= Math.PI/12;

                this.play([
                    v1.animate.setValue(value1),
                    v2.animate.setValue(value2),
                ], 10, "linear");
            }

            value1 -= Math.PI/24;
            value2 -= Math.PI/144;

            this.play([
                v1.animate.setValue(value1),
                v2.animate.setValue(value2),
            ], 2, "easeOut");
        }

    }
}