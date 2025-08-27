import { Point, Quaternion, Vector3 } from '@kurtbruns/vector';
import { MapMouseToPointAndRotate } from "../06_RotateEarth/MapMouseToPointAndRotate";
import { EarthOrientationUtils } from "../EarthOrientationUtils";
import { EarthScene } from "../EarthScene";

export class ZoomOutFromBroomBridge extends EarthScene {
    constructor() {

        // Focus on San Francisco
        const broombridgeQuaternion = EarthOrientationUtils.quaternionToLocationByName('Broom Bridge');
        super({
            cameraPosition: new Vector3(0, 0, -4),
            drawIJK:false,
            showQuaternionTex: false,
            drawTriangleMesh: true
        });

        this.q.set(broombridgeQuaternion);
        
        this.play([
            this.camera.animate.moveTo(new Vector3(0, 0, -5))
        ], 1.5);

        this.wait(4.5);


    }
}
