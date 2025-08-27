import { Point, Value, Vector3 } from '@kurtbruns/vector';
import { RotateEarth } from "../06_RotateEarth/RotateEarth";
import { EarthOrientationUtils } from "../EarthOrientationUtils";

export class RotateEarthAnimateMouse extends RotateEarth {
    constructor() {
        const broombridgeQuaternion = EarthOrientationUtils.quaternionToLocationByName('Broom Bridge');
        const sanFranciscoQuaternion = EarthOrientationUtils.quaternionToLocationByName('San Francisco');

        super({
            drawTex: false
        });

        this.q.set(broombridgeQuaternion);

        this.enableMouseSimulation();

        let mouseStartX = 0.46;
        let mouseStartY = 0.805;
        let mouseEndX = 0.65;
        let mouseEndY = 0.65;

        const bbox = this.viewPort.frame.root.getBoundingClientRect();
        let startX = bbox.left + bbox.width * mouseStartX;
        let startY = bbox.top + bbox.height * mouseStartY;
        let endX = bbox.left + bbox.width * mouseEndX;
        let endY = bbox.top + bbox.height * mouseEndY;
    
        // Set up the simulation
        this.setStartingPosition(startX, startY);

        this.displayCones.setOpacity(0);

        this.play([
            this.displayCones.animate.setOpacity(1)
        ], 1);

        // Animate the mouse movement
        this.play([
            this.mouse.animate.moveTo(new Point(endX, endY)),
        ], 3);

        this.wait(3)

        this.play([
            this.displayCones.animate.setOpacity(0)
        ], 1.5);

        this.play([
            this.q.animate.slerp(sanFranciscoQuaternion),
            this.camera.animate.moveTo(new Vector3(0, 0, -4))
        ], 5);

    }
} 