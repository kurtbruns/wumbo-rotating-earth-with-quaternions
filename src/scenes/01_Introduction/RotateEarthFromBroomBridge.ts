import { Point, Quaternion, Vector3 } from '@kurtbruns/vector';
import { MapMouseToPointAndRotate } from "../06_RotateEarth/MapMouseToPointAndRotate";
import { EarthOrientationUtils } from "../EarthOrientationUtils";

export class RotateEarthFromBroomBridge extends MapMouseToPointAndRotate {
    constructor() {

        // const mouseStartX = 0.72;
        // const mouseStartY = 0.42;
        const mouseStartX = 0.4;
        const mouseStartY = 0.8;
        const mouseEndX = 0.72;
        const mouseEndY = 0.42;

        // Focus on San Francisco
        const sanFranciscoQuaternion = EarthOrientationUtils.quaternionToLocationByName('San Francisco');
        const broombridgeQuaternion = EarthOrientationUtils.quaternionToLocationByName('Broom Bridge');
        super({
            mouseStartX: mouseStartX,
            mouseStartY: mouseStartY,
            mouseEndX: mouseEndX,
            mouseEndY: mouseEndY,
            distance: -4,
            initialQuaternion: broombridgeQuaternion,
            firstAnimationDuration: 4.5
        });

        this.displayMouseGroup.setOpacity(0);
        this.shadowMouseGroup.setOpacity(0);

        this.reset = () => {
            // Refresh cached bounding box to ensure it's current
            this.cachedBbox = this.viewPort.frame.root.getBoundingClientRect();
            
            // Use the same cached bounding box for consistent initialization
            const bbox = this.cachedBbox;
            const startX = bbox.left + bbox.width * mouseStartX;
            const startY = bbox.top + bbox.height * mouseStartY; // Use same Y as in mouse.update
            const startVector = this.projectOnTrackball(startX, startY);
            this.p1.set(Quaternion.fromVector(startVector));
            this.p2.set(Quaternion.fromVector(startVector));

            this.shadowMouse.set(new Point(startX, startY));
            this.t.value = 0;
            this.clear();

            this.play([
                this.camera.animate.moveTo(new Vector3(0, 0, -5))
            ], 1);

            this.play([
                this.displayMouseGroup.animate.setOpacity(1),
                this.shadowMouseGroup.animate.setOpacity(0.66),
            ], 1);

            this.play([
                this.t.animate.setValue(1)
            ], 4.5)

        }
        this.reset();

    }
}
