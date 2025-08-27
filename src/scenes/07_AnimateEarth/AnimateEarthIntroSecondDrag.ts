import { Point, Quaternion, Value } from '@kurtbruns/vector';
import { MapMouseToPointAndRotate } from "../06_RotateEarth/MapMouseToPointAndRotate";
import { EarthOrientationUtils } from "../EarthOrientationUtils";

export class AnimateEarthIntroSecondDrag extends MapMouseToPointAndRotate {
    constructor() {

        // const mouseStartX = 0.72;
        // const mouseStartY = 0.42;
        // const mouseEndX = 0.4;
        // const mouseEndY = 0.8;

        const mouseStartX = 0.695;
        const mouseStartY = 0.467;
        // const mouseEndX = 0.75;
        // const mouseEndY = 0.30;

        const mouseEndX = 0.295;
        const mouseEndY = 0.467;

        const broombridgeQuaternion = EarthOrientationUtils.quaternionToLocationByName('Broom Bridge');

        super({
            mouseStartX: mouseStartX,
            mouseStartY: mouseStartY,
            mouseEndX: mouseEndX,
            mouseEndY: mouseEndY,
            distance: -5,
            initialQuaternion: new Quaternion(-0.4166, 0.4590, -0.5801, -0.5285),
            firstAnimationDuration: 4.5
        });

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

            this.play([
                this.displayMouseGroup.animate.setOpacity(1)
            ],0.5)

            this.play([
                this.t.animate.setValue(1)
            ], 2)

            this.play([
                this.shadowMouseGroup.animate.setOpacity(0),
                this.displayMouseGroup.animate.setOpacity(0),
            ], 1);

            this.wait()
    
            this.play([
                this.q.animate.slerp(broombridgeQuaternion)
            ], 3);

            this.wait(2);




            // this.play([
            //     this.q.animate.slerp(broombridgeQuaternion)
            // ], 3);
            // this.wait(3);
        }
        this.reset();

    }
}
