import { Quaternion, Vector3, Point, Circle, Vector2, Line, Value} from "../../vector/src";
import { EarthScene } from "../EarthScene";


export class MapMouseToPointOnSphere extends EarthScene {

    p1: Quaternion;
    p2: Quaternion;
    rotationQuaternion: Quaternion;
    q_copy: Quaternion;

    point: Vector3;
    displayPoint: Circle;
    mouse: Point;
    mouse3D: Vector3;
    displayLine: Line;
    dummyMouse: any; // SVG element for the dummy mouse
    dummyMousePosition: Vector2;
    animationId: number | null = null;

    constructor() {
        super({
            cameraPosition: new Vector3(0, 0, -5),
            drawIJK:false,
            showQuaternionTex: false,
            drawTriangleMesh: true
            
        });

        this.p1 = new Quaternion();
        this.p2 = new Quaternion();
        this.rotationQuaternion = new Quaternion();
        this.q_copy = new Quaternion();

        this.mouse = new Point();
        this.point = new Vector3();
        this.mouse3D = new Vector3();
        this.dummyMousePosition = new Vector2(0, 0);

        // Set up dependencies: point and mouse3D depend on mouse
        this.point.addDependency(this.mouse);
        this.point.update = () => {
            // Convert mouse position to point on sphere using trackball projection
            const bbox = this.viewPort.frame.root.getBoundingClientRect();
            const v = this.projectOnTrackball(this.mouse.x, this.mouse.y, bbox);
            this.point.set(v);
        };

        this.mouse3D.addDependency(this.mouse);
        this.mouse3D.update = () => {
            // Convert mouse position to 3D world coordinates
            const bbox = this.viewPort.frame.root.getBoundingClientRect();
            const worldPoint = this.screenToWorld(this.mouse.x, this.mouse.y, bbox, 1.0);
            this.mouse3D.set(worldPoint);
        };

        this.displayPoint = this.drawPointOnSphere(this.point)
        this.displayLine = this.line(this.mouse3D, this.point, 'var(--font-color)');
        this.displayLine.setOpacity(0);
        this.displayLine.setAttribute('stroke-width', '2px');
        this.displayLine.setAttribute('stroke-dasharray', '6, 6');

        // Create the mouse cursor as a path element
        const path = this.viewPort.frame.path("m320-410 79-110h170L320-716v306ZM551-80 406-392 240-160v-720l560 440H516l144 309-109 51ZM399-520Z");
        path.setAttribute('fill', 'var(--font-color)');
        path.setAttribute('transform', 'scale(0.05) translate(-240, 880)');
        this.dummyMouse = path;

        
        let t = new Value(0)
        let w = new Value(0)
        this.mouse.addDependency(t, w)
        this.mouse.update = () => {
            // Parameterize mouse moving along a line between two points
            const bbox = this.viewPort.frame.root.getBoundingClientRect();
            
            // Define start and end points
            const startX = bbox.left + bbox.width * 0.4;
            const startY = bbox.top + bbox.height * 0.8;
            const endX = bbox.left + bbox.width * 0.68;
            const endY = bbox.top + bbox.height * 0.45;

            const pointX = - bbox.width * (0.68 - 0.35);
            const pointY = - bbox.height * (0.45 - 0.2);
            
            // Linear interpolation: p = start + t * (end - start)
            const localX = startX + t.value * (endX - startX) + w.value * pointX;
            const localY = startY + t.value * (endY - startY) + w.value * pointY;
            
            this.mouse.set(new Point(localX, localY));
        }

        let group = this.viewPort.frame.group();
        group.appendChild(this.dummyMouse);
        group.setAttribute('transform', `translate(${this.mouse.x}, ${this.mouse.y})`);
        group.addDependency(this.mouse)
        group.update = () => {
            let p = this.screenToWorld(this.mouse.x, this.mouse.y, this.viewPort.frame.root.getBoundingClientRect(), 1.0)
            let u = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(p))
            group.setAttribute('transform', `translate(${u.x}, ${u.y})`);
        }

        t.updateDependents()

        this.wait(2)

        this.play([
            t.animate.setValue(1)
        ], 4)

        this.play([
            w.animate.setValue(1)
        ], 4)

        this.wait(3)

        this.play([
            t.animate.setValue(0),
            w.animate.setValue(0)
        ], 4)

        this.wait(2)

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
    screenToWorld(screenX: number, screenY: number, bbox: DOMRect, cameraSpaceZ: number): Vector3 {
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
    projectOnTrackball(touchX: number, touchY: number, bbox: DOMRect, r: number = 0.5) {
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
        let isDragging = false;
        let isSpaceDown = false;
        let upAxis: 'x' | 'y' | 'z' = 'z';
        let prevX: number = 0;
        let prevY: number = 0;
        let bbox = this.viewPort.frame.root.getBoundingClientRect();
        
        // Mouse down handler
        const handleMouseDown = (event: MouseEvent) => {
            if (this.viewPort.frame.root.contains(event.target as HTMLElement)) {
                this.displayPoint.setOpacity(1);
                this.q_copy.set(this.q);
                bbox = this.viewPort.frame.root.getBoundingClientRect();
                this.p1.set(Quaternion.fromVector(this.projectOnTrackball(event.clientX, event.clientY, bbox)));
                console.log(this.p1.toFormattedString())
                isDragging = true;
            }
        };

        // Mouse move handler
        const handleMouseMove = (event: MouseEvent) => {
            if (isDragging && (event.clientX !== prevX || event.clientY !== prevY)) {
                // Update mouse position - this will trigger the dependency system
                this.mouse.set(new Point(event.clientX, event.clientY));
                this.mouse.updateDependents();
                
                let bbox = this.viewPort.frame.root.getBoundingClientRect();

                const v2 = this.projectOnTrackball(event.clientX, event.clientY, bbox);
                this.p2.set(Quaternion.fromVector(v2));

                this.rotationQuaternion.set(this.p2.multiply(this.p1.conjugate()).pow(0.5));

                // this.q.set(this.rotationQuaternion.multiply(this.q_copy));

                event.preventDefault();
            }
        };

        // Mouse up handler
        const handleMouseUp = () => {
            isDragging = false;
            this.viewPort.plot.releaseBoundingRect();
            this.viewPort.plot.releaseCTM();
            // this.displayPoint.setOpacity(0);
        };


        // Attach event listeners
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

    }

}