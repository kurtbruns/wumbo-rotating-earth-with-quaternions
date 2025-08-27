import { Quaternion, Vector3, Point, Value, Path, Group } from '@kurtbruns/vector';
import { RotateEarth } from "./RotateEarth";
import { SECOND_DRAG_MOUSE_START_X, SECOND_DRAG_MOUSE_START_Y, SECOND_DRAG_MOUSE_END_X, SECOND_DRAG_MOUSE_END_Y } from "./mousePositions";

export interface RotateEarthAnimatedOptions {
    mouseStartX?: number;
    mouseStartY?: number;
    mouseEndX?: number;
    mouseEndY?: number;
    distance?: number;
    initialQuaternion?: Quaternion;
    firstAnimationDuration?: number;
}

export class RotateEarthAnimated extends RotateEarth {
    t: Value;
    w: Value;
    m: Value;
    isDraggingValue: Value;
    cachedBbox: DOMRect | null = null;
    
    // Visual elements for mouse simulation
    displayMouse: Path;
    displayMouseGroup: Group;

    constructor(options: RotateEarthAnimatedOptions = {}) {
        const defaultConfig = {
            mouseStartX: SECOND_DRAG_MOUSE_START_X,
            mouseStartY: SECOND_DRAG_MOUSE_START_Y,
            mouseEndX: SECOND_DRAG_MOUSE_END_X,
            mouseEndY: SECOND_DRAG_MOUSE_END_Y,
            distance: -5,
            firstAnimationDuration: 4
        };

        const config = { ...defaultConfig, ...options };

        super({
            drawTex: true
        });

        // Override camera position if specified
        if (config.distance !== -5) {
            this.camera.position.set(new Vector3(0, 0, config.distance));
            this.camera.updateDependents();
        }

        // Set initial quaternion if provided
        if (config.initialQuaternion) {
            this.q.set(config.initialQuaternion);
            this.q_copy.set(config.initialQuaternion);
        }

        // Cache the bounding box once at initialization
        this.cachedBbox = this.viewPort.frame.root.getBoundingClientRect();

        // Create mouse elements group
        this.displayMouseGroup = this.viewPort.frame.group();

        // Create the mouse cursor as a path element
        this.displayMouse = this.viewPort.frame.path("m320-410 79-110h170L320-716v306ZM551-80 406-392 240-160v-720l560 440H516l144 309-109 51ZM399-520Z");
        this.displayMouse.setAttribute('fill', 'var(--font-color)');
        this.displayMouse.setAttribute('transform', 'scale(0.05) translate(-240, 880)');

        // Create animation values
        this.t = new Value(0);
        this.w = new Value(0);
        this.m = new Value(0);
        this.isDraggingValue = new Value(0);

        // Set up mouse position dependency on animation values
        this.mouse.addDependency(this.t, this.w, this.m);
        this.mouse.update = () => {
            // Use cached bounding box to ensure consistency
            const bbox = this.cachedBbox || this.viewPort.frame.root.getBoundingClientRect();
                
            // Define start and end points
            const startX = bbox.left + bbox.width * config.mouseStartX;
            const startY = bbox.top + bbox.height * config.mouseStartY;
            const endX = bbox.left + bbox.width * config.mouseEndX;
            const endY = bbox.top + bbox.height * config.mouseEndY;
            
            // Linear interpolation: p = start + t * (end - start)
            const localX = startX + this.t.value * (endX - startX) + this.w.value * (-0.10) * bbox.width + this.m.value * (-0.1) * bbox.width;
            const localY = startY + this.t.value * (endY - startY) + this.w.value * (-0.45) * bbox.height + this.m.value * (0.2) * bbox.height;
            
            this.mouse.set(new Point(localX, localY));
        };
        this.mouse.update(); // Initialize mouse position

        // Set up quaternion dependency for rotation simulation
        this.q.addDependency(this.mouse, this.t, this.isDraggingValue);
        this.q.update = () => {
            // Always update when mouse or t changes, but only apply rotation when needed
            const v2 = this.projectOnTrackballCached(this.mouse.x, this.mouse.y);
            this.p2.set(Quaternion.fromVector(v2));

            // Only apply rotation when dragging
            if (this.isDraggingValue.value !== 0) {
                this.rotationQuaternion.set(this.p2.multiply(this.p1.conjugate()).pow(0.5));
                this.q.set(this.rotationQuaternion.multiply(this.q_copy));
            } else {
                // When not dragging, keep the current orientation
                this.q.set(this.q_copy);
            }
        };
        this.q.update(); // Initialize quaternion state

        // Set up mouse cursor positioning
        let mouseGroup = this.viewPort.frame.group();
        mouseGroup.appendChild(this.displayMouse);
        mouseGroup.addDependency(this.mouse);
        mouseGroup.update = () => {
            let p = this.screenToWorld(this.mouse.x, this.mouse.y, 1.0);
            let u = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(p));
            mouseGroup.setAttribute('transform', `translate(${u.x}, ${u.y})`);
        };
        this.displayMouseGroup.appendChild(mouseGroup);

        // Set up the reset function for animation
        // this.reset = () => {
        //     // Refresh cached bounding box to ensure it's current
        //     this.cachedBbox = this.viewPort.frame.root.getBoundingClientRect();
            
        //     // Use the same cached bounding box for consistent initialization
        //     const bbox = this.cachedBbox;
        //     const startX = bbox.left + bbox.width * config.mouseStartX;
        //     const startY = bbox.top + bbox.height * config.mouseStartY;
            
        //     // Initialize p1 and p2 with the starting position
        //     const startVector = this.projectOnTrackballCached(startX, startY);
        //     this.p1.set(Quaternion.fromVector(startVector));
        //     this.p2.set(Quaternion.fromVector(startVector));
        //     this.rotationQuaternion.set(this.p2.multiply(this.p1.conjugate()).pow(0.5));
            
        //     // Set starting position for mouse simulation
        //     this.setStartingPosition(startX, startY);
            
        //     // Initialize animation values
        //     this.t.value = 0;
        //     this.w.value = 0;
        //     this.m.value = 0;
            
        //     // Clear any existing animations
        //     this.clear();
            
        //     // // Start the animation sequence
        //     // this.wait();
            
        //     // // Enable mouse simulation (equivalent to starting a drag)
        //     // this.enableMouseSimulation();
            
        //     // // Animate the mouse movement
        //     // this.play([
        //     //     this.t.animate.setValue(1)
        //     // ], config.firstAnimationDuration);
            
        //     // this.wait(3);
            
        //     // // Disable mouse simulation (equivalent to stopping a drag)
        //     // this.disableMouseSimulation();
            
        //     // this.wait(2);
        // };

        // // Start the animation
        // this.reset();
    }

    /**
     * Override enableMouseSimulation to also update the Value
     */
    enableMouseSimulation() {
        super.enableMouseSimulation();
        this.isDraggingValue.value = 1;
    }

    /**
     * Override disableMouseSimulation to also update the Value
     */
    disableMouseSimulation() {
        // Update q_copy to the current orientation before disabling
        this.q_copy.set(this.q);
        super.disableMouseSimulation();
        this.isDraggingValue.value = 0;
    }

    /**
     * Project coordinates onto trackball using cached bounding box for consistency
     */
    protected projectOnTrackballCached(touchX: number, touchY: number, r: number = 0.5, invert: boolean = false): Vector3 {
        // Use cached bounding box for consistency during animation
        const bbox = this.cachedBbox || this.viewPort.frame.root.getBoundingClientRect();
        
        let x = (invert ? 1 : -1) * (touchX - bbox.left - bbox.width / 2) / bbox.height;
        let y = (invert ? 1 : -1) * (touchY - bbox.top - bbox.height / 2) / bbox.height;
        let z = 0.0;
        let distance = x * x + y * y;
        if (distance <= r * r / 2) {
            // Inside sphere
            z = Math.sqrt(r * r - distance);
        } else {
            // On hyperbola
            z = (r * r / 2) / Math.sqrt(distance);
        }

        return new Vector3(-x, y, z).normalize();
    }

    /**
     * Converts a 2D screen point to a 3D world point given a z-coordinate in camera space.
     * This is the inverse of the projection process.
     * 
     * @param screenX - Screen x coordinate
     * @param screenY - Screen y coordinate  
     * @param cameraSpaceZ - The z-coordinate in camera space where we want the 3D point
     * @returns Vector3 - The 3D point in world space
     */
    screenToWorld(screenX: number, screenY: number, cameraSpaceZ: number): Vector3 {
        // Use cached bounding box for consistency during dragging, otherwise get fresh one
        let bbox = this.cachedBbox || this.viewPort.frame.root.getBoundingClientRect();

        // Convert screen coordinates to viewport coordinates using proper SVG transformation
        const viewportPoint = this.viewPort.plot.screenToSVG(screenX, screenY);
        
        const scale = Math.tan(this.camera.fov * 0.5 * Math.PI / 180) * this.camera.nearPlane;
        
        // Calculate the x and y coordinates in camera space
        const cameraSpaceX = viewportPoint.x * cameraSpaceZ / scale;
        const cameraSpaceY = viewportPoint.y * cameraSpaceZ / scale;
        
        // Create the point in camera space
        const cameraSpacePoint = new Vector3(cameraSpaceX, cameraSpaceY, cameraSpaceZ);
        
        // Transform from camera space back to world space
        // First, apply inverse quaternion rotation
        const relativePoint = cameraSpacePoint.apply(this.camera.orientation.inverse());
        
        // Then add camera position to get world coordinates
        const worldPoint = relativePoint.add(this.camera.position);
        
        // Finally, flip the z-coordinate back (since we flipped it in projectPoint)
        return new Vector3(worldPoint.x, worldPoint.y, -worldPoint.z);
    }
} 