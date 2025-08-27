import { Quaternion, Value, Point } from '@kurtbruns/vector';
import { RotateEarthAnimated } from "./RotateEarthAnimated";
import { SECOND_DRAG_MOUSE_START_X, SECOND_DRAG_MOUSE_START_Y, SECOND_DRAG_MOUSE_END_X, SECOND_DRAG_MOUSE_END_Y, FIRST_DRAG_MOUSE_START_X, FIRST_DRAG_MOUSE_START_Y, FIRST_DRAG_MOUSE_END_X, FIRST_DRAG_MOUSE_END_Y } from "./mousePositions";

export class RotateEarthAnimatedFirstDrag extends RotateEarthAnimated {
    coneOpacity: Value;

    constructor() {
        super({
            mouseStartX: FIRST_DRAG_MOUSE_START_X,
            mouseStartY: FIRST_DRAG_MOUSE_START_Y,
            mouseEndX: FIRST_DRAG_MOUSE_END_X,
            mouseEndY: FIRST_DRAG_MOUSE_END_Y,
            distance: -5,
            initialQuaternion: new Quaternion(1, 0, 0, 0), // Start with identity quaternion
            firstAnimationDuration: 4
        });

        // Create cone opacity value
        this.coneOpacity = new Value(1);

        // Set up cone opacity dependency
        this.displayCones.addDependency(this.coneOpacity);
        this.displayCones.update = () => {
            this.displayCones.setAttribute('opacity', this.coneOpacity.value.toFixed(2));
        };
        this.displayCones.update();

        // Override the reset function for the first drag animation
        this.reset = () => {

            // Refresh cached bounding box to ensure it's current
            this.cachedBbox = this.viewPort.frame.root.getBoundingClientRect();
            
            // Use the same cached bounding box for consistent initialization
            const bbox = this.cachedBbox;
            const startX = bbox.left + bbox.width * FIRST_DRAG_MOUSE_START_X;
            const startY = bbox.top + bbox.height * FIRST_DRAG_MOUSE_START_Y;
            
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
            this.coneOpacity.value = 1;
            
            // Clear any existing animations
            this.clear();
            
            // Enable mouse simulation (equivalent to starting a drag)
            this.enableMouseSimulation();

            // Start the animation sequence
            this.wait();
            
            // Animate the mouse movement
            this.play([
                this.t.animate.setValue(1)
            ], 4);
            
            this.wait(1);
            
            this.play([
                this.coneOpacity.animate.setValue(0)
            ], 1);
        
        };

        // Start the animation
        this.reset();
    }
} 