import { Point, Quaternion, Vector3 } from "../../vector/src";
import { MapMouseToPointAndRotate } from "../06_RotateEarth/MapMouseToPointAndRotate";
import { EarthOrientationUtils } from "../EarthOrientationUtils";
import { EarthScene } from "../EarthScene";

export class RotateEarthAmericasToBroomBridge extends EarthScene {
    constructor() {

        // Focus on San Francisco
        const broombridgeQuaternion = EarthOrientationUtils.quaternionToLocationByName('Broom Bridge');
        super({
            cameraPosition: new Vector3(0, 0, -4),
            drawIJK:false,
            showQuaternionTex: false,
            drawTriangleMesh: true
        });

        this.q.set(new Quaternion(-0.4836, 0.4364, 0.5083, 0.5633).normalize());

        this.play([
            this.q.animate.slerp(broombridgeQuaternion)
        ], 5);

        this.wait(5);

    }
}
