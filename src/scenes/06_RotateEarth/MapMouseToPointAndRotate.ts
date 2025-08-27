import { Quaternion, Vector3, Point, Circle, Vector2, Line, Value, Path, interpolateColor, Group} from "../../vector/src";
import { EarthScene } from "../EarthScene";

export interface MapMouseToPointAndRotateOptions {
    mouseStartX?: number;
    mouseStartY?: number;
    mouseEndX?: number;
    mouseEndY?: number;
    distance?: number;
    initialQuaternion?: Quaternion;
    firstAnimationDuration?: number;
    showQuaternionTex?: boolean;
}

export class MapMouseToPointAndRotate extends EarthScene {

    p1: Quaternion;
    p2: Quaternion;
    rotationQuaternion: Quaternion;
    q_copy: Quaternion;

    point: Vector3;
    displayPoint: Circle;
    mouse: Point;
    mouse3D: Vector3;
    displayLine: Line;
    displayMouse: Path;
    expandingLinesGroup: any;

    displayMouseGroup: Group;
    shadowMouseGroup: Group;

    isDragging: any;
    active: boolean;
    cachedBbox: DOMRect | null = null;
    shadowMouse3D: Vector3;
    shadowPoint: Vector3;
    shadowMouse: Point;
    t: Value;
    w: Value;
    m: Value;

    constructor(options: MapMouseToPointAndRotateOptions = {}) {
        
        let defaultConfig = {
            mouseStartX: 0.4,
            mouseStartY: 0.8,
            mouseEndX: 0.68,
            mouseEndY: 0.45,
            distance: -5,
            firstAnimationDuration: 4,
            showQuaternionTex: false
        }

        let config = { ...defaultConfig, ...options}
        
        super({
            cameraPosition: new Vector3(0, 0, config.distance),
            drawIJK:false,
            drawTriangleMesh: true,
            showQuaternionTex: options.showQuaternionTex
            
        });
        

        this.p1 = new Quaternion(0, 0, 0, 1);
        this.p2 = new Quaternion(0, 0, 0, 1);
        this.rotationQuaternion = Quaternion.identity();
        this.q_copy = this.q.copy();

        // Set initial quaternion if provided
        if (config.initialQuaternion) {
            this.q.set(config.initialQuaternion);
            this.q_copy.set(config.initialQuaternion);
        }

        this.mouse = new Point();
        this.point = new Vector3();
        this.mouse3D = new Vector3();

        // Cache the bounding box once at initialization
        this.cachedBbox = this.viewPort.frame.root.getBoundingClientRect();

        // Set up dependencies: point and mouse3D depend on mouse
        this.point.addDependency(this.mouse);
        this.point.update = () => {
            // Convert mouse position to point on sphere using trackball projection
            const v = this.projectOnTrackball(this.mouse.x, this.mouse.y);
            this.point.set(v);
        };
        this.point.update();

        this.mouse3D.addDependency(this.mouse);
        this.mouse3D.update = () => {
            // Convert mouse position to 3D world coordinates
            const worldPoint = this.screenToWorld(this.mouse.x, this.mouse.y, 1.0);
            this.mouse3D.set(worldPoint);
        };
        this.mouse3D.update();

        
        // Create shadow mouse elements group
        this.shadowMouseGroup = this.viewPort.frame.group();
        this.shadowMouseGroup.setOpacity(0.667);

        let shadowDisplayGroup = this.shadowMouseGroup.group();

        // Create mouse elements group
        this.displayMouseGroup = this.viewPort.frame.group();

        this.displayLine = this.line(this.point, this.mouse3D, 'var(--font-color)');
        this.displayLine.setOpacity(0);
        this.displayLine.setAttribute('stroke-width', '2px');
        this.displayLine.setAttribute('stroke-dasharray', '8, 8');
        this.displayMouseGroup.appendChild(this.displayLine);

        this.displayPoint = this.drawPointOnSphere(this.point, {radius: 3})
        // this.displayPoint.setAttribute('stroke', 'var(--earth-blue)');
        // this.displayPoint.setAttribute('stroke-width', '1.5px');
        this.displayMouseGroup.appendChild(this.displayPoint);

        // Create expanding lines group
        this.expandingLinesGroup = this.viewPort.frame.group();
        this.expandingLinesGroup.setOpacity(0);

        // Create the mouse cursor as a path element
        this.displayMouse = this.viewPort.frame.path("m320-410 79-110h170L320-716v306ZM551-80 406-392 240-160v-720l560 440H516l144 309-109 51ZM399-520Z");
        this.displayMouse.setAttribute('fill', 'var(--font-color)');
        this.displayMouse.setAttribute('transform', 'scale(0.05) translate(-240, 880)');
        
        this.t = new Value(0)
        this.w = new Value(0)
        this.m = new Value(0)
        this.mouse.addDependency(this.t, this.w, this.m)
        this.mouse.update = () => {
            // Use cached bounding box to ensure consistency
            const bbox = this.cachedBbox || this.viewPort.frame.root.getBoundingClientRect();
                
            // Define start and end points
            const startX = bbox.left + bbox.width * config.mouseStartX;
            const startY = bbox.top + bbox.height * config.mouseStartY;
            const endX = bbox.left + bbox.width * config.mouseEndX;
            const endY = bbox.top + bbox.height * config.mouseEndY;
            
            // Linear interpolation: p = start + t * (end - start)
            const localX = startX + this.t.value * (endX - startX) + this.w.value * (-0.10)*bbox.width + this.m.value * (-0.1)*bbox.width;
            const localY = startY + this.t.value * (endY - startY) + this.w.value * (-0.45)*bbox.height + this.m.value * ( 0.2)*bbox.height;
            
            this.mouse.set(new Point(localX, localY));
        }
        this.mouse.update(); // Initialize mouse position


        this.q.addDependency(this.mouse, this.t)
        this.q.update = () => {
            // Always update when mouse or t changes, but only apply rotation when needed
            const v2 = this.projectOnTrackball(this.mouse.x, this.mouse.y);
            this.p2.set(Quaternion.fromVector(v2));

            // Only apply rotation when animation is active or dragging
            if(this.t.value !== 0 || this.isDragging) {
                this.rotationQuaternion.set(this.p2.multiply(this.p1.conjugate()).pow(0.5));
                this.q.set(this.rotationQuaternion.multiply(this.q_copy));
            } else {
                // When not animating, keep the current orientation
                this.q.set(this.q_copy);
            }
        }
        this.q.update(); // Initialize quaternion state

        let mouseGroup = this.viewPort.frame.group();
        mouseGroup.appendChild(this.displayMouse);
        mouseGroup.setAttribute('transform', `translate(${this.mouse.x}, ${this.mouse.y})`);
        mouseGroup.addDependency(this.mouse)
        mouseGroup.update = () => {
            let p = this.screenToWorld(this.mouse.x, this.mouse.y, 1.0)
            let u = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(p))
            mouseGroup.setAttribute('transform', `translate(${u.x}, ${u.y})`);
        }
        this.displayMouseGroup.appendChild(mouseGroup);

        this.t.updateDependents()

        this.shadowMouse = new Point();
        this.shadowPoint = this.point.copy();
        this.shadowMouse3D = this.mouse3D.copy();
        const shadowDisplay = true;
        shadowDisplayGroup.setOpacity(0.75);
        let shadowDisplayGroupColor = 'var(--font-color)';
        if( shadowDisplay ) {


            let shadowLine = this.line(this.shadowPoint, this.shadowMouse3D, shadowDisplayGroupColor);
            shadowLine.setAttribute('stroke-dasharray', '8, 8');
            shadowLine.setAttribute('stroke-width', '2px');
            this.shadowMouseGroup.appendChild(shadowLine);

            let shadowPoint = this.drawPointOnSphere(this.shadowPoint, {radius: 3, color: shadowDisplayGroupColor});
            this.shadowMouseGroup.appendChild(shadowPoint);

            let shadowMouseGroup = this.viewPort.frame.group();
            shadowMouseGroup.addDependency(this.shadowMouse)
            shadowMouseGroup.update = () => {
                let p = this.screenToWorld(this.shadowMouse.x, this.shadowMouse.y, 1.0)
                let u = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(p))
                shadowMouseGroup.setAttribute('transform', `translate(${u.x}, ${u.y})`);
            }
            shadowMouseGroup.update();

            let shadowMouse = this.viewPort.frame.path(this.displayMouse.d);
            shadowMouse.setAttribute('fill', shadowDisplayGroupColor);
            shadowMouse.setAttribute('transform', 'scale(0.05) translate(-240, 880)');
            shadowMouseGroup.appendChild(shadowMouse);
            this.shadowMouseGroup.appendChild(shadowMouseGroup);
            
        }
        this.reset = () => {
            // Refresh cached bounding box to ensure it's current
            this.cachedBbox = this.viewPort.frame.root.getBoundingClientRect();
            
            // Use the same cached bounding box for consistent initialization
            const bbox = this.cachedBbox;
            const startX = bbox.left + bbox.width * config.mouseStartX;
            const startY = bbox.top + bbox.height * config.mouseStartY; // Use same Y as in mouse.update
            const startVector = this.projectOnTrackball(startX, startY);
            this.p1.set(Quaternion.fromVector(startVector));
            this.p2.set(Quaternion.fromVector(startVector));

            this.shadowMouse.set(new Point(startX, startY));
            this.t.value = 0;
            this.clear();
            this.wait()
            this.play([
                this.t.animate.setValue(1)
            ], config.firstAnimationDuration)
            this.wait(3)

            this.play([
                this.shadowMouseGroup.animate.setOpacity(0),
                this.displayMouseGroup.animate.setOpacity(0)
            ])
            // this.play([
            //     this.w.animate.setValue(1),
            // ])
            // this.play([
            //     this.m.animate.setValue(1),
            // ], 3)
            this.wait(2)

        }
        this.reset();



    }

    /**
     * Converts a 2D screen point to a 3D world point given a z-coordinate in camera space.
     * This is the inverse of the projection process.
     * 
     * @param screenX - Screen x coordinate
     * @param screenY - Screen y coordinate  
     * @param bbox - Bounding box of the viewport
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


    screenToPoint(screenX: number, screenY: number, bbox: DOMRect) {
        // Note, the bounding box changes for some reason.
        const rect = bbox;
        let x = (screenX - rect.left - rect.width / 2) / rect.height;
        let y = -(screenY - rect.top + rect.height / 2) / rect.height;
        return new Vector2(x, y);
    }

    /**
     * Projects the coordinates onto the northern hemisphere of a sphere.
     */
    projectOnTrackball(touchX: number, touchY: number, r: number = 0.5) {

        // Use cached bounding box for consistency during dragging, otherwise get fresh one
        let bbox = this.cachedBbox || this.viewPort.frame.root.getBoundingClientRect();
        let x = (touchX - bbox.left - bbox.width / 2) / bbox.height;
        let y = -(touchY - bbox.top - bbox.height / 2) / bbox.height;

        let z = 0.0;
        let distance = x * x + y * y;
        if (distance <= r * r / 2) {
            // Inside sphere
            z = Math.sqrt(r * r - distance);
        } else {
            // On hyperbola
            z = (r * r / 2) / Math.sqrt(distance);
        }

        let v = new Vector3(x, y, z).normalize();
        return v;
    }

    registerEventListeners(r = 2, invert = false) {

        r = 0.5;
        this.active = false;
        this.isDragging = true;
        let prevX: number = 0;
        let prevY: number = 0;
        
        
        // Mouse down handler
        const handleMouseDown = (event: MouseEvent) => {
            if (this.viewPort.frame.root.contains(event.target as HTMLElement)) {
                // Cache the bounding box on mouse down for consistent calculations
                this.cachedBbox = this.viewPort.frame.root.getBoundingClientRect();

                this.shadowMouse.set(new Point(event.clientX, event.clientY));
                this.shadowMouse3D.set(this.screenToWorld(event.clientX, event.clientY, 1.0));
                this.shadowPoint.set(this.projectOnTrackball(event.clientX, event.clientY));

                // Set up the drag state BEFORE setting mouse position (which triggers dependency system)
                this.displayPoint.setOpacity(1);
                this.q_copy.set(this.q);
                this.p1.set(Quaternion.fromVector(this.projectOnTrackball(event.clientX, event.clientY)));
                
                // Now set mouse position, which will trigger the dependency system with proper state
                this.mouse.set(new Point(event.clientX, event.clientY));
                
                let displayColor = interpolateColor('var(--purple)', 'var(--font-color)', 0.25)
                this.displayLine.setAttribute('stroke', displayColor);
                this.displayPoint.setAttribute('fill', displayColor);
                this.displayMouse.setAttribute('fill', displayColor);

                this.active = true;
                this.isDragging = true;
            }
        };

        // Mouse move handler
        const handleMouseMove = (event: MouseEvent) => {
            if (this.active && (event.clientX !== prevX || event.clientY !== prevY)) {
                // Update mouse position - this will trigger the dependency system
                this.mouse.set(new Point(event.clientX, event.clientY));
                event.preventDefault();
            }
            prevX = event.clientX;
            prevY = event.clientY;
        };

        // Mouse up handler
        const handleMouseUp = () => {
            this.isDragging = false;
            this.active = false;
            // Clear the cached bounding box on mouse up
            this.cachedBbox = null;
            this.viewPort.plot.releaseBoundingRect();
            this.viewPort.plot.releaseCTM();
            this.displayLine.setAttribute('stroke', 'var(--font-color)');
            this.displayPoint.setAttribute('fill', 'var(--font-color)');
            this.displayMouse.setAttribute('fill', 'var(--font-color)');

            // this.displayPoint.setOpacity(0);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                console.log(this.q.toConstructor())
            }
        };


        // Attach event listeners
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('keydown', handleKeyDown);

    }

    /**
     * Creates expanding lines from a point with configurable parameters
     * @param centerX - X coordinate of the center point
     * @param centerY - Y coordinate of the center point
     * @param innerRadius - Starting radius for the lines
     * @param outerRadius - Ending radius for the lines
     * @param numLines - Number of lines to draw around the circle
     * @param t - Animation parameter (0 to 1)
     */
    drawExpandingLines(centerX: number, centerY: number, innerRadius: number, outerRadius: number, numLines: number, t: number) {
        // Clear existing lines
        while (this.expandingLinesGroup.root.children.length > 0) {
            this.expandingLinesGroup.root.removeChild(this.expandingLinesGroup.root.lastChild);
        }
        
        // Position the group at the center
        this.expandingLinesGroup.setAttribute('transform', `translate(${centerX}, ${centerY})`);
        
        // Calculate current radius based on t
        const currentRadius = innerRadius + t * (outerRadius - innerRadius);
        
        // Draw lines from center to current radius
        for (let i = 0; i < numLines; i++) {
            const angle = (i * 2 * Math.PI) / numLines;
            const endX = Math.cos(angle) * currentRadius;
            const endY = Math.sin(angle) * currentRadius;
            
            const line = this.expandingLinesGroup.line(0, 0, endX, endY);
            line.setAttribute('stroke', '#ffd700');
            line.setAttribute('stroke-width', '2px');
        }
        
        // Set opacity based on t (fade out as lines expand)
        this.expandingLinesGroup.setOpacity(1 - t * 0.5);
    }

}