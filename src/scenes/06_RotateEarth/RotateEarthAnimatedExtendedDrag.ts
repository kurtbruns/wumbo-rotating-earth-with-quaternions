import { Point, Quaternion } from '@kurtbruns/vector';
import { RotateEarthAnimated } from "./RotateEarthAnimated";
import { SECOND_DRAG_MOUSE_START_X, SECOND_DRAG_MOUSE_START_Y, SECOND_DRAG_MOUSE_END_X, SECOND_DRAG_MOUSE_END_Y, FIRST_DRAG_MOUSE_END_Y, FIRST_DRAG_MOUSE_START_X, FIRST_DRAG_MOUSE_START_Y } from "./mousePositions";

export class RotateEarthAnimatedExtendedDrag extends RotateEarthAnimated {
    constructor() {

        const mouseStartX = SECOND_DRAG_MOUSE_START_X;
        const mouseStartY = SECOND_DRAG_MOUSE_START_Y;
        const mouseEndX = FIRST_DRAG_MOUSE_START_X;
        const mouseEndY = FIRST_DRAG_MOUSE_START_Y;
        
        // Add a third control point for Bezier curve
        const mouseControlX = 0.5;
        const mouseControlY = 1.25;

        super({
            mouseStartX: mouseStartX,
            mouseStartY: mouseStartY,
            mouseEndX: mouseEndX,
            mouseEndY: mouseEndY,
            distance: -5,
            initialQuaternion: new Quaternion(0.8001, -0.1848, 0.2650, 0.5053),
            firstAnimationDuration: 4.5
        });


        // ovverride update function
        this.mouse.addDependency(this.t);
        this.mouse.update = () => {
            // Use cached bounding box to ensure consistency
            const bbox = this.cachedBbox || this.viewPort.frame.root.getBoundingClientRect();
                
            // Define start, control, and end points
            const startX = bbox.left + bbox.width * mouseStartX;
            const startY = bbox.top + bbox.height * mouseStartY;
            const controlX = bbox.left + bbox.width * mouseControlX;
            const controlY = bbox.top + bbox.height * mouseControlY;
            const endX = bbox.left + bbox.width * mouseEndX;
            const endY = bbox.top + bbox.height * mouseEndY;
            
            // Quadratic Bezier curve interpolation: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
            const t = this.t.value;
            const oneMinusT = 1 - t;
            const oneMinusTSquared = oneMinusT * oneMinusT;
            const tSquared = t * t;
            
            const localX = oneMinusTSquared * startX + 2 * oneMinusT * t * controlX + tSquared * endX;
            const localY = oneMinusTSquared * startY + 2 * oneMinusT * t * controlY + tSquared * endY;
            
            this.mouse.set(new Point(localX, localY));
        };
        this.mouse.update(); 

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
            ], 5);

            this.wait(2);
        };

        // Start the animation
        this.reset();
    }
} 