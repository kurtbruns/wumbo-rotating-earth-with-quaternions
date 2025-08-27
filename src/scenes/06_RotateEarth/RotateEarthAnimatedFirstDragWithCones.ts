import { Quaternion } from "../../vector/src";
import { RotateEarthAnimated } from "./RotateEarthAnimated";
import { SECOND_DRAG_MOUSE_START_X, SECOND_DRAG_MOUSE_START_Y, SECOND_DRAG_MOUSE_END_X, SECOND_DRAG_MOUSE_END_Y, FIRST_DRAG_MOUSE_START_X, FIRST_DRAG_MOUSE_START_Y, FIRST_DRAG_MOUSE_END_X, FIRST_DRAG_MOUSE_END_Y } from "./mousePositions";

export class RotateEarthAnimatedFirstDragWithCones extends RotateEarthAnimated {
    constructor() {
        const mouseStartX = FIRST_DRAG_MOUSE_START_X;
        const mouseStartY = FIRST_DRAG_MOUSE_START_Y;
        const mouseEndX = FIRST_DRAG_MOUSE_END_X;
        const mouseEndY = FIRST_DRAG_MOUSE_END_Y;

        super({
            mouseStartX: mouseStartX,
            mouseStartY: mouseStartY,
            mouseEndX: mouseEndX,
            mouseEndY: mouseEndY,
            distance: -5,
            initialQuaternion: new Quaternion(1,0,0,0),
            firstAnimationDuration: 4.5
        });

        // Override the reset function for the second drag animation
        this.reset = () => {

             // Refresh cached bounding box to ensure it's current
             this.cachedBbox = this.viewPort.frame.root.getBoundingClientRect();
            
             // Use the same cached bounding box for consistent initialization
             const bbox = this.cachedBbox;
             const startX = bbox.left + bbox.width * mouseStartX;
             const startY = bbox.top + bbox.height * mouseStartY;
             
             // Initialize p1 and p2 with the starting position
             const startVector = this.projectOnTrackballCached(startX, startY);
             this.p1.set(Quaternion.fromVector(startVector));
             this.p2.set(Quaternion.fromVector(startVector));
             
             // Set starting position for mouse simulation
             this.setStartingPosition(startX, startY);
             
             // Initialize animation values
             this.t.value = 0;
             this.w.value = 0;
             this.m.value = 0;
             this.isDraggingValue.value = 0;

             // Clear any existing animations
             this.clear();
             
             // Enable mouse simulation (equivalent to starting a drag)
             this.enableMouseSimulation();
 
             // Start the animation sequence
             this.wait();
            
            // Start with a short wait
            this.wait(0.5);
            
            // Animate the mouse movement with different duration
            this.play([
                this.t.animate.setValue(1)
            ], 3);

            this.wait(2);
        };

        // Start the animation
        this.reset();
    }
} 