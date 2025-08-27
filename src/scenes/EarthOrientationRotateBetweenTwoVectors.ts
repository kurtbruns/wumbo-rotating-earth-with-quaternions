import { Quaternion, Scene3D, Value, Vector2, Vector3 } from "../vector/src";
import { EarthScene } from "./EarthScene";


export class EarthOrientationRotateBetweenTwoVectors extends EarthScene {
    constructor() {

        super({

        });

        this.reset = () => {

            this.clear();

            let start = this.q.transform(new Vector3(0, 0, 1))
            let end = new Vector3(0, 1, 0);

            const cross = start.cross(end);
            const dot = start.dot(end);
        
            // Calculate the quaternion components
            const w = Math.sqrt(start.length() * end.length()) + dot;
            const x = cross.x;
            const y = cross.y;
            const z = cross.z;

            // Create and normalize the quaternion
            let q = new Quaternion(w, x, y, z).normalize();

            // TODO: how does the above quaternion `q` represent the same rotation as `u`
            let angle = Math.acos(dot/Math.sqrt(start.length() * end.length()))
            let axis = cross.normalize()

            let u = Quaternion.fromAxisAngle(axis, angle);

            console.log(angle)
            console.log(2*Math.acos(q.w))

            this.play([
                this.q.animate.slerp(q.multiply(this.q))
            ], Math.acos(q.w)*3 + 1)


        }
        

    }


}