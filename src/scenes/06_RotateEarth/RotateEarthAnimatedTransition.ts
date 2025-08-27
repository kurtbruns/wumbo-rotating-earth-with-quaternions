import { Quaternion, Value, Point } from "../../vector/src";
import { RotateEarthAnimated } from "./RotateEarthAnimated";
import { FIRST_DRAG_MOUSE_END_X, FIRST_DRAG_MOUSE_END_Y, FIRST_DRAG_MOUSE_START_X, FIRST_DRAG_MOUSE_START_Y, SECOND_DRAG_MOUSE_START_X, SECOND_DRAG_MOUSE_START_Y } from "./mousePositions";

export class RotateEarthAnimatedTransition extends RotateEarthAnimated {
    coneOpacity: Value;

    constructor() {

        super({
            mouseStartX: FIRST_DRAG_MOUSE_START_X,
            mouseStartY: FIRST_DRAG_MOUSE_START_Y,
            mouseEndX: FIRST_DRAG_MOUSE_END_X,
            mouseEndY: FIRST_DRAG_MOUSE_END_Y,
            distance: -5,
            initialQuaternion: new Quaternion(0.7932, -0.3333, 0.4598, 0.2196),
            firstAnimationDuration: 4
        });

        this.disableEventListeners = true;

        // Create cone opacity value
        this.coneOpacity = new Value(0);

        // Set up cone opacity dependency
        this.displayCones.addDependency(this.coneOpacity);
        this.displayCones.update = () => {
            this.displayCones.setAttribute('opacity', this.coneOpacity.value.toFixed(2));
        };
        this.displayCones.update();

        // Set starting position for mouse simulation
        this.mouse.moveTo(693.3, 497);
        
        // Override the reset function for the transition animation
        this.reset = () => {

                       
            // Clear any existing animations
            this.clear();
    
            this.wait()
            
            // Create a simple animation that moves the mouse cursor
            this.play([
                // this.mouse.animate.moveTo(new Point(secondDragStartX, secondDragStartY))
                this.mouse.animate.moveTo(new Point(395.7, 372.8))
            ], 2);
            
            this.wait(2);
        };
        
        // Start the animation
        this.reset();
    }

} 