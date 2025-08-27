import { Point, Quaternion } from '@kurtbruns/vector';
import { MapMouseToPointAndRotate } from "../06_RotateEarth/MapMouseToPointAndRotate";
import { EarthOrientationUtils } from "../EarthOrientationUtils";
import { SECOND_DRAG_MOUSE_START_X, SECOND_DRAG_MOUSE_START_Y, SECOND_DRAG_MOUSE_END_X, SECOND_DRAG_MOUSE_END_Y } from "./mousePositions";

export class MapMouseToPointAndRotateSecondDrag extends MapMouseToPointAndRotate {
    constructor() {

        const mouseStartX = SECOND_DRAG_MOUSE_START_X;
        const mouseStartY = SECOND_DRAG_MOUSE_START_Y;
        const mouseEndX = SECOND_DRAG_MOUSE_END_X;
        const mouseEndY = SECOND_DRAG_MOUSE_END_Y;

        super({
            mouseStartX: mouseStartX,
            mouseStartY: mouseStartY,
            mouseEndX: mouseEndX,
            mouseEndY: mouseEndY,
            distance: -5,
            initialQuaternion: new Quaternion(0.7932, -0.3333, 0.4598, 0.2196),
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

            this.displayMouseGroup.setOpacity(0)
            this.shadowMouseGroup.setOpacity(0)

            this.clear();

            this.wait(0.5)

            this.play([
                this.displayMouseGroup.animate.setOpacity(1),
                this.shadowMouseGroup.animate.setOpacity(0.667),
            ], 0.5);

            this.play([
                this.t.animate.setValue(1)
            ], 3)

            // this.play([
            //     this.displayMouseGroup.animate.setOpacity(0),
            //     this.shadowMouseGroup.animate.setOpacity(0),
            // ], 1);
            // this.wait(3);
        }
        this.reset();

    }
}
