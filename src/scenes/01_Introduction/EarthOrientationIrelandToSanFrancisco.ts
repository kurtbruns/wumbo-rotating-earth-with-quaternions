import { Quaternion, Vector3 } from "../../vector/src";
import { EarthScene } from "../EarthScene";
import { EarthOrientationUtils } from "../EarthOrientationUtils";


export class EarthOrientationIrelandToSanFrancisco extends EarthScene {
    constructor() {

        super({
            cameraPosition: new Vector3(0, 0, -3.6),
            drawIJK: false,
            showQuaternionTex: false,
            drawTriangleMesh: true

        });


        let latLongs = EarthOrientationUtils.latLongs;

        const latLongToVector3 = (coords: number[]): Vector3 => {
            return EarthOrientationUtils.latLongToVector3(coords as [number, number]);
        }

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


        const quaternionTo = (coords: number[]): Quaternion => {
            return EarthOrientationUtils.quaternionToLocation(coords as [number, number]);
        }

        const quaternionToWithUp = (coords: number[], upVector: Vector3): Quaternion => {
            let lat = coords[0];
            let long = coords[1];

            // Step 1: Compute the base quaternion using lat/long like before
            let dest = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), -Math.PI / 2 - long * Math.PI / 180);
            dest = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2 + lat * Math.PI / 180).multiply(dest);

            // Step 2: Align the resulting quaternion with the provided up vector

            // Assuming the current "up" is the world's up (0, 1, 0)
            const currentUp = new Vector3(0, 1, 0);

            // Find the angle between the current up vector and the desired up vector
            const dot = currentUp.dot(upVector);
            const angle = Math.acos(dot); // Angle between the vectors

            // If the vectors are not aligned, apply the rotation to align the up vectors
            if (angle > 0.0001) { // Some tolerance to avoid unnecessary computations
                const alignmentQuaternion = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), angle);
                dest = alignmentQuaternion.multiply(dest);
            }

            return dest;
        }

        const rotate = (q: Quaternion, vector: Vector3): Quaternion => {

            // Transform the input vector by the quaternion q to get its current orientation
            const transformedVector = q.transform(vector);
        
            // Project the transformed vector onto the X-Y plane (ignore the Z component)
            const projectedVector = new Vector3(transformedVector.x, transformedVector.y, 0).normalize();
        
            // The reference up direction on the X-Y plane
            const up = new Vector3(0, 1, 0);
        
            // Calculate the angle between the projected vector and the Y-axis
            const angle = 2*Math.acos(projectedVector.dot(up));
        
            // Determine the sign of the angle using the cross product
            const crossZ = projectedVector.cross(up).z;
            const signedAngle = crossZ < 0 ? -angle : angle;
        
            // Create a quaternion for the rotation around the Z-axis
            const rotationQuaternion = Quaternion.fromAxisAngle(new Vector3(0, 0, -1), signedAngle).normalize();
        
            // Return the resulting quaternion after applying the Z-axis rotation to the current quaternion q
            return rotationQuaternion.multiply(q).normalize();
        };

        let radians = (n: number) => {
            return EarthOrientationUtils.radians(n);
        }

        let states: Quaternion[] = [
            Quaternion.fromEulerAngles(radians(90), 0, 0),
            Quaternion.fromEulerAngles(0, radians(-45), radians(90)),
            Quaternion.fromEulerAngles(0, 0, 0),
            Quaternion.fromEulerAngles(radians(180), 0, radians(180)),
        ]

        let standardUp = new Vector3(0, 1, 0);
        let standardDown = new Vector3(0, -1, 0);
        let up = latLongToVector3(latLongs['San Francisco']);
        let up2 = latLongToVector3(latLongs['Broom Bridge']);

        // let up = new Vector3(0, 1, 0)
        let start = latLongs['Broom Bridge']
        let end = latLongs['San Francisco']

        let q0 = quaternionTo(start)
        let q1 = rotate(q0, standardDown);
        let q2 = rotate(quaternionTo(start), up);

        this.q.set(q0);

        // this.vector(this.origin, up)

        this.reset = () => {

            this.clear();

            // this.play([
            //     this.q.animate.slerp(q1),
            // ], 3)

            // this.play([
            //     this.q.animate.slerp(q2),
            // ], 3)

            // this.play([
            //     this.q.animate.slerp(endingOrientation),
            // ], Math.acos(q.w)*10 + 1.5)

        }
        this.reset();




    }


}