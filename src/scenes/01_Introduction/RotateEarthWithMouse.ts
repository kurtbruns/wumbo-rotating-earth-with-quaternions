import { Point, Quaternion } from "../../vector/src";
import { MapMouseToPointAndRotate } from "../06_RotateEarth/MapMouseToPointAndRotate";
import { EarthOrientationUtils } from "../EarthOrientationUtils";

export class RotateEarthWithMouse extends MapMouseToPointAndRotate {
    constructor() {

        // const mouseStartX = 0.72;
        // const mouseStartY = 0.42;
        // const mouseEndX = 0.4;
        // const mouseEndY = 0.8;

        const mouseStartX = 0.295;
        const mouseStartY = 0.445;
        const mouseEndX = 0.4;
        const mouseEndY = 0.8;

        // Focus on San Francisco
        const sanFranciscoQuaternion = EarthOrientationUtils.quaternionToLocationByName('San Francisco');
        const broombridgeQuaternion = EarthOrientationUtils.quaternionToLocationByName('Broom Bridge');
        super({
            mouseStartX: mouseStartX,
            mouseStartY: mouseStartY,
            mouseEndX: mouseEndX,
            mouseEndY: mouseEndY,
            distance: -4,
            initialQuaternion: sanFranciscoQuaternion,
            firstAnimationDuration: 4.5
        });

        this.shadowMouseGroup.setOpacity(0.75);

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
                this.t.animate.setValue(1)
            ], 4.5)

            this.play([
                this.displayMouseGroup.animate.setOpacity(0),
                this.shadowMouseGroup.animate.setOpacity(0),
            ], 1);
            this.play([
                this.q.animate.slerp(broombridgeQuaternion)
            ], 3);
            this.wait(3);
        }
        this.reset();

    }
}
