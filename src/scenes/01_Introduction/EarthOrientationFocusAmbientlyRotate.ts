import { Quaternion, Vector3 } from "../../vector/src";
import { EarthScene } from "../EarthScene";
import { EarthOrientationUtils } from "../EarthOrientationUtils";


export class EarthOrientationFocusAmbientlyRotate extends EarthScene {
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

            // Set initial orientation to Broom Bridge
            let initialOrientation = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), -Math.PI - long * Math.PI / 180);
            initialOrientation = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2 + lat * Math.PI / 180).multiply(initialOrientation);
            
            this.q.set(initialOrientation);

            let northPole = this.q.transform(new Vector3(0, 0, 1));

            
            // Animate rotation around North Pole
            this.play([
                this.q.animate.rotate(northPole, Math.PI/24),
            ], 1, "easeIn");

            this.play([
                this.q.animate.rotate(northPole, Math.PI/2),
            ], 5, "linear");

            this.play([
                this.q.animate.rotate(northPole, Math.PI/2),
            ], 5, "linear");

        }

    }
}