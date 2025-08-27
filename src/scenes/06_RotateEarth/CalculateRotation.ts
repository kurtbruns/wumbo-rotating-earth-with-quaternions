import { Point, Quaternion, Tex } from '@kurtbruns/vector';
import { MapMouseToPointAndRotate } from "../06_RotateEarth/MapMouseToPointAndRotate";
import { EarthOrientationUtils } from "../EarthOrientationUtils";
import { SECOND_DRAG_MOUSE_START_X, SECOND_DRAG_MOUSE_START_Y, SECOND_DRAG_MOUSE_END_X, SECOND_DRAG_MOUSE_END_Y } from "./mousePositions";

export class CalculateRotation extends MapMouseToPointAndRotate {
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


        let q1Tex = this.viewPort.frame.tex('q_1 = w_1 + x_1 i + y_1 j + z_1 k');
        q1Tex.setAttribute('font-size', '18px');
        q1Tex.alignCenter();
        q1Tex.moveTo(this.viewPort.frame.width * 0.5 + 32, 50);
        q1Tex.setAttribute('opacity', '0');

        let q2Tex = this.viewPort.frame.tex('q_2 = r \\cdot q_1');
        q2Tex.setAttribute('font-size', '18px');
        q2Tex.alignCenter();
        q2Tex.moveTo(this.viewPort.frame.width * 0.5 + 32, 94);
        q2Tex.setAttribute('opacity', '0');

        Tex.alignHorizontallyBy(q1Tex, q2Tex, 'q_1', 'q_2');

        let rotationTex = this.viewPort.frame.tex('r = \\cos \\left( \\frac{\\theta}{2} \\right) + \\sin \\left( \\frac{\\theta}{2} \\right) \\left( x i + y j + z k \\right)');
        rotationTex.setAttribute('font-size', '18px');
        rotationTex.alignCenter();
        rotationTex.moveTo(this.viewPort.frame.width * 0.5 + 32, this.viewPort.frame.height - 80);
        rotationTex.setColorAll('\\theta', '#72D6BF');
        rotationTex.setColorAll('\\left( x i + y j + z k \\right)', 'var(--pink)');
        rotationTex.setAttribute('opacity', '0');

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
            this.t.set(1);


            this.clear();

            this.wait();

            this.play([
                rotationTex.animate.setOpacity(1),
            ], 1);

            this.wait(8.5);

            this.play([
                q1Tex.animate.setOpacity(1),
            ], 1);

            this.wait(2.5)

            this.play([
                q2Tex.animate.setOpacity(1),
            ], 1);

            this.wait(9.5)

            this.play([
                rotationTex.animate.setOpacity(0),
                q1Tex.animate.setOpacity(0),
                q2Tex.animate.setOpacity(0),
            ], 1);

            this.wait()

        }
        this.reset();

    }
}
