import { RotateEarth } from "./RotateEarth";
import { Quaternion } from "../../vector/src";
import { SECOND_DRAG_MOUSE_START_X, SECOND_DRAG_MOUSE_START_Y, SECOND_DRAG_MOUSE_END_X, SECOND_DRAG_MOUSE_END_Y } from "./mousePositions";

export class CalculateRotationCones extends RotateEarth {

    constructor() {
        super();

        // Set up mouse positions similar to CalculateRotationPartThree
        const mouseStartX = SECOND_DRAG_MOUSE_START_X;
        const mouseStartY = SECOND_DRAG_MOUSE_START_Y;
        const mouseEndX = SECOND_DRAG_MOUSE_END_X;
        const mouseEndY = SECOND_DRAG_MOUSE_END_Y;

        // Set initial quaternion
        this.q.set(new Quaternion(0.7932, -0.3333, 0.4598, 0.2196));
        this.q_copy.set(new Quaternion(0.7932, -0.3333, 0.4598, 0.2196));

        // Get the bounding box to convert normalized coordinates to screen coordinates
        const bbox = this.viewPort.frame.root.getBoundingClientRect();
        const startX = bbox.left + bbox.width * mouseStartX;
        const startY = bbox.top + bbox.height * mouseStartY;
        const endX = bbox.left + bbox.width * mouseEndX;
        const endY = bbox.top + bbox.height * mouseEndY;

        // Set up mouse simulation with the converted screen coordinates
        this.setStartingPosition(startX, startY);
        this.enableMouseSimulation();
        
        // Simulate mouse movement to end position by updating the mouse point
        // This will trigger the dependency and call handleMouseMovement automatically
        this.mouse.moveTo(endX, endY);
        
        this.disableMouseSimulation();

        this.wait()
    }

}