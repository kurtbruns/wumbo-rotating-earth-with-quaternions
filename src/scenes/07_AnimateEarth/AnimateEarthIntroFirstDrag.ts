import { Point, Quaternion, Value } from '@kurtbruns/vector';
import { MapMouseToPointAndRotate } from "../06_RotateEarth/MapMouseToPointAndRotate";
import { EarthOrientationUtils } from "../EarthOrientationUtils";

export class AnimateEarthIntroFirstDrag extends MapMouseToPointAndRotate {
    constructor() {

        // const mouseStartX = 0.72;
        // const mouseStartY = 0.42;
        // const mouseEndX = 0.4;
        // const mouseEndY = 0.8;

        const mouseStartX = 0.65;
        const mouseStartY = 0.80;
        // const mouseEndX = 0.75;
        // const mouseEndY = 0.30;

        const mouseEndX = 0.28;
        const mouseEndY = 0.40;

        // Focus on San Francisco
        const sanFranciscoQuaternion = EarthOrientationUtils.quaternionToLocationByName('San Francisco');
        const broombridgeQuaternion = EarthOrientationUtils.quaternionToLocationByName('Broom Bridge');
        super({
            mouseStartX: mouseStartX,
            mouseStartY: mouseStartY,
            mouseEndX: mouseEndX,
            mouseEndY: mouseEndY,
            distance: -5,
            initialQuaternion: broombridgeQuaternion,
            firstAnimationDuration: 4.5,
            showQuaternionTex: false
        });

        // this.shadowMouseGroup.setOpacity(0.75);
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

            const startX2 = bbox.left + bbox.width * mouseEndX;
            const startY2 = bbox.top + bbox.height * mouseEndY;

            let value = new Value(0);
            this.shadowMouse.set(new Point(startX, startY));

            this.shadowMouse.addDependency(value);
            this.shadowMouse.update = () => {
                if (value.value < 1) {
                    this.shadowMouse.set(new Point(startX, startY));
                } else {
                    this.shadowMouse.set(new Point(startX2, startY2));
                }
            }
            this.shadowMouse.update();

            this.t.value = 0;

            this.displayMouseGroup.setAttribute('opacity', '0')

            this.clear();


            this.wait(0.5)

            this.play([
                this.displayMouseGroup.animate.setOpacity(1)
            ],0.5)
            this.play([
                this.t.animate.setValue(1)
            ], 3)

            this.play([
                this.shadowMouseGroup.animate.setOpacity(0),
                this.displayMouseGroup.animate.setOpacity(0)
            ], 0.5);
            
        }
        this.reset();

    }
}
