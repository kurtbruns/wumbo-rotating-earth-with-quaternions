import { Quaternion, Vector3, Line, Group, Vector2, interpolateColor, Tex, Value, Point } from '@kurtbruns/vector';
import { EarthScene } from "../EarthScene";


export interface RotateEarthOptions {
    drawTex?: boolean;
}

export class RotateEarth extends EarthScene {

    p1: Quaternion;
    p2: Quaternion;
    startPosition: Tex;
    endPosition: Tex;
    rotationQuaternion: Quaternion;
    axisArrow: Line;
    q_copy: Quaternion;
    mouse: Point;
    mousePosition: Point;
    startingMousePosition: Point;
    isDragging: boolean = false;
    prevX: number = 0;
    prevY: number = 0;
    disableEventListeners: boolean = false;
    displayCones: Group;

    constructor(options: RotateEarthOptions = {}) {

        const defaultOptions: RotateEarthOptions = {
            drawTex: true
        }

        options = { ...defaultOptions, ...options };

        super({
            cameraPosition: new Vector3(0, 0, -5),
            drawIJK: false,
            showQuaternionTex: false,
            drawTriangleMesh: true,
            // drawAxes: true,

        });
        this.q_copy = new Quaternion();
        this.p1 = new Quaternion();
        this.p2 = new Quaternion();
        this.rotationQuaternion = new Quaternion();
        this.mouse = new Point(0, 0);
        this.mousePosition = new Point(0, 0);
        this.startingMousePosition = new Point(0, 0);
        
        // Set up dependency: when mouse changes, update mousePosition and handle movement
        this.mousePosition.addDependency(this.mouse);
        this.mousePosition.update = () => {
            // Update to new position
            this.mousePosition.set(this.mouse);
            
            // Handle movement using the same logic as real mouse events
            this.handleMouseMovement();
        };


        // this.startPosition = this.vectorTex(this.startVector, '\\vec{\\mathbf{v}} = ');
        // this.startPosition.moveTo(100, 100);
        // this.endPosition = this.vectorTex(this.endVector, '\\vec{\\mathbf{w}} = ');
        // this.endPosition.moveTo(100, 200);

        if (options.drawTex) {

            this.startPosition = this.quaternionAsTex(this.p1, 'p_1', [
                { part: 'p_1', color: 'var(--yellow)' }
            ]);

            // this.startPosition.alignCenter();
            this.startPosition.moveTo(36, this.viewPort.frame.height - 150);
            this.endPosition = this.quaternionAsTex(this.p2, 'p_2', [
                { part: 'p_2', color: 'var(--cyan)' }
            ]);
            // this.endPosition.alignCenter();
            this.endPosition.moveTo(36, this.viewPort.frame.height - 100);

            let product = new Quaternion();
            product.addDependency(this.p1, this.p2, this.rotationQuaternion);
            product.update = () => {
                product.set(this.rotationQuaternion);
            }
            product.update();
            let productTex = this.quaternionAsTexWithComplexHighlight(product, '\\left( \\, p_2 \\cdot \\overline{p_1} \\, \\right)^{\\frac{1}{2}}', [
                { part: '\\overline{p_1}', color: 'var(--yellow)' },
                { part: 'p_2', color: 'var(--cyan)' },
            ]);

            // productTex.alignCenter();
            // productTex.moveTo(this.viewPort.frame.width/2, this.viewPort.frame.height - 36);
            productTex.moveTo(36, this.viewPort.frame.height - 55);

        }

        // Always draw the cone arrows regardless of drawTex setting
        let axisVector = new Vector3(0, 0, 1);
        axisVector.addDependency(this.rotationQuaternion);
        axisVector.update = () => {
            axisVector.set(this.rotationQuaternion.toVector3().normalize());
        }
        axisVector.update();

        let axisVector2 = new Vector3(0, 0, -1);
        axisVector2.addDependency(this.rotationQuaternion);
        axisVector2.update = () => {
            axisVector2.set(this.rotationQuaternion.toVector3().normalize().scale(-1));
        }
        axisVector2.update();

        this.displayCones = this.viewPort.frame.group();
        this.displayCones.appendChild(this.drawStaticConeArrowOutOfSphere(axisVector, 1, 1.5, 'var(--pink)'));
        this.displayCones.appendChild(this.drawStaticConeArrowOutOfSphere(axisVector2, 1, 1.5, 'var(--font-color)'));

        let startArrow = this.arrowFromQuaternion(this.p1);
        let endArrow = this.arrowFromQuaternion(this.p2);
        this.displayCones.appendChild(this.drawStaticConeArrowOutOfSphere(startArrow, 1, 1.5, 'var(--yellow)'));
        this.displayCones.appendChild(this.drawStaticConeArrowOutOfSphere(endArrow, 1, 1.5, 'var(--cyan)'));

        if (options.drawTex) {
            this.displayTex = this.viewPort.frame.tex('q_1 = w_1 + x_1 i + y_1 j + z_1 k');
            this.displayTex.setAttribute('font-size', '18px');
            this.displayTex.alignCenter();
            this.displayTex.moveTo(this.viewPort.frame.width / 2, 36)
            this.displayTex.addDependency(this.q_copy);
            this.displayTex.update = () => {
                this.displayTex.replace('q_1=' + this.q_copy.toFormattedString());
                this.displayTex.alignCenter();
            };
            // this.displayTex.update();

            let computeTex = this.viewPort.frame.tex('q_2 = \\left( p_2 \\cdot \\overline{p_1} \\right)^{\\frac{1}{2}} \\cdot q_1 = w_2 + x_2 i + y_2 j + z_2 k');
            computeTex.setAttribute('font-size', '18px');
            computeTex.setColor('p_2', 'var(--cyan)');
            computeTex.setColor('\\overline{p_1}', 'var(--yellow)');
            computeTex.alignCenter();
            computeTex.moveTo(this.viewPort.frame.width / 2, 72)
            computeTex.addDependency(this.q);
            computeTex.update = () => {
                computeTex.replace(`q_2 = \\left( p_2 \\cdot \\overline{p_1} \\right)^{\\frac{1}{2}} \\cdot q_1 = ${this.q.toFormattedString()}`);
                computeTex.setColor('p_2', 'var(--cyan)');
                computeTex.setColor('\\overline{p_1}', 'var(--yellow)');
                computeTex.alignCenter();
            };
            // computeTex.update();

            Tex.alignHorizontallyBy(this.displayTex, computeTex, '=');
        }

    }

    arrowFromQuaternion(q: Quaternion): Vector3 {
        let v = q.toVector3();
        v.addDependency(q)
        v.update = () => {
            v.set(q.toVector3());
        }
        v.update();
        return v;
    }

    quaternionAsTex(q: Quaternion, varName: string, parts: Array<{ part: string, color: string }>): Tex {

        let t = this.viewPort.frame.tex('')
        t.setAttribute('font-size', '18px');
        t.addDependency(q);
        t.update = () => {
            let texString = `${varName} = ${q.toFormattedString(2)}`;
            t.replace(texString);

            // Set colors for all parts
            parts.forEach(({ part, color }) => {
                t.setColor(part, color);
            });
        };
        t.update();
        return t;
    }

    quaternionAsTexWithComplexHighlight(q: Quaternion, varName: string, parts: Array<{ part: string, color: string }>): Tex {

        let t = this.viewPort.frame.tex('')
        t.setAttribute('font-size', '18px');
        t.addDependency(q);
        t.update = () => {
            let format = (n: number, isFirst: boolean = false) => {
                let epsilon = 0.00000001;
                if (Math.abs(n) < epsilon) {
                    return isFirst ? '0.00' : '+0.00';
                }
                return (n >= 0 ? (isFirst ? '' : '+') : '') + n.toFixed(2);
            };

            // Create a structured LaTeX string with placeholders for coloring
            let texString = `${varName} = ${format(q.w, true)} ${format(q.x)}i ${format(q.y)}j ${format(q.z)}k`;
            t.replace(texString);

            // Set colors for all parts
            parts.forEach(({ part, color }) => {
                t.setColor(part, color);
            });

            // Always highlight the complex part (i, j, k components) in pink
            // For i component, only highlight the number part, not the + sign
            if (Math.abs(q.x) > 0.00000001) {
                let iComponent = `${format(q.x)}i`;
                let numberPart = q.x >= 0 ? q.x.toFixed(2) : format(q.x);
                t.setColor(numberPart, 'var(--pink)');
                t.setColor('i', 'var(--pink)');
            }
            if (Math.abs(q.y) > 0.00000001) {
                t.setColor(`${format(q.y)}j`, 'var(--pink)');
            }
            if (Math.abs(q.z) > 0.00000001) {
                t.setColor(`${format(q.z)}k`, 'var(--pink)');
            }
        };
        t.update();
        return t;
    }

    vectorTex(v: Vector3, prefix: string = ''): Tex {

        let format = (n: number): string => {
            if (Number(n).toString().length > 2) {
                return n.toFixed(3);
            } else {
                return Number(n).toString();
            }
        }

        let t = this.viewPort.frame.tex('')
        t.addDependency(v);
        t.update = () => {
            let x = format(v.x);
            let y = format(v.y);
            let z = format(v.z);
            t.replace(`${prefix}\\left[\\begin{array}{c} \\: ${x} \\: \\\\ \\: ${y} \\: \\\\ \\: ${z} \\: \\end{array}\\right]`)
        };
        t.update();
        return t;
    }

    drawStaticConeArrowOutOfSphere(v: Vector3, radius: number, multiplier: number = 1.5, color: string = "var(--font-color)", coneRadius = 0.1) {
        let group = this.viewPort.frame.group();
        const vStart = new Vector3();
        const vEnd = new Vector3();

        vStart.addDependency(v);
        vStart.update = () => {
            vStart.set(v.normalize().scale(radius));
        };
        vStart.update();

        group.appendChild(this.drawPointOnSphere(vStart, { color: color }));

        vEnd.addDependency(v);
        vEnd.update = () => {
            vEnd.set(v.normalize().scale(radius * multiplier));
        };
        vEnd.update();

        let l = this.viewPort.frame.line(0, 0, 0, 0)
        l.setAttribute('stroke', color);
        l.setAttribute('stroke-width', '1.5px');

        l.addDependency(vStart, vEnd, this.camera);
        l.update = () => {
            let epsilon = 0.55;
            let dot = this.normal.dot(vStart);
            if (dot < -epsilon) {
                l.setAttribute('opacity', '0');
            } else {
                l.setAttribute('opacity', (0.7 * Math.abs(dot + epsilon)).toFixed(2));
            }

            let d = this.camera.position.length();
            let s = d * 1 / Math.sqrt(d * d - 1);

            let temp = vStart;
            if (dot < 0.22) {
                temp = this.camera.closestPointOnPlane(vStart, this.camera.orientation).normalize().scale(s)
            }

            let t1 = this.camera.projectPoint(temp);
            let t2 = this.camera.projectPoint(vEnd);

            let p1 = this.viewPort.plot.SVGToRelative(t1);
            let p2 = this.viewPort.plot.SVGToRelative(t2);

            l.x1 = p1.x;
            l.y1 = p1.y;
            l.x2 = p2.x;
            l.y2 = p2.y;
        }
        l.update();
        group.appendChild(l);

        group.appendChild(this.drawStaticDisappearingCone(coneRadius, vEnd, color));

        return group;
    }

    drawStaticDisappearingCone(radius: number, pos: Vector3 = new Vector3(0, 0, 1), color: string): Group {
        let maxOpacity = 0.75;
        let apexHeight = radius * 2.5;
        let longs = this.generateCircle(72, radius);
        let group = this.viewPort.frame.group();
        group.setAttribute('opacity', maxOpacity.toFixed(2))

        let apex = new Vector3();
        apex.addDependency(pos);
        apex.update = () => {
            let t = pos.add(pos.normalize().scale(apexHeight));
            apex.set(t)

            let epsilon = 0.5;
            // Adjust opacity based on the average dot product
            let dot = this.normal.dot(t.normalize());
            if (dot < 0) {
                group.setAttribute('opacity', (maxOpacity * Math.max(1 + 1.2 * dot, 0)).toFixed(2));
            } else {
                group.setAttribute('opacity', maxOpacity.toFixed(2));
            }
        }
        apex.update();

        let apexCircle = this.drawPoint(apex, { radius: 0.8, color: color, opacity: 0.75 });

        // Create the base path
        let base = group.path();
        base.setAttribute('stroke', color);
        base.setAttribute('fill', interpolateColor(color, 'var(--background)', 0.5));
        base.setAttribute('fill-rule', 'nonzero');
        base.setAttribute('fill-opacity', '0.5');
        base.setAttribute('stroke-width', '1.5px');
        base.setAttribute('stroke-opacity', '0.15');
        base.addDependency(pos, apex, this.camera, this.camera.position);
        base.update = () => {
            let u = pos;
            let q = Quaternion.rotationToVector(u);
            let d = '';
            let visiblePoints = [];

            // Project all points of the circle base to 2D
            for (let j = 0; j < longs.length; j++) {
                let point = longs[j].copy().apply(q).add(u);
                let v = this.camera.projectPoint(point);
                if (v.z !== 0) {  // Skip points that can't be projected
                    let w = this.viewPort.plot.SVGToRelative(v);
                    visiblePoints.push(w);
                }
            }

            let dot = this.normal.dot(u);

            // Always draw the circle base
            if (visiblePoints.length > 0) {
                d += `M ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
                for (let i = 1; i < visiblePoints.length; i++) {
                    d += `L ${visiblePoints[i].x.toFixed(3)} ${visiblePoints[i].y.toFixed(3)} `;
                }
                d += `L ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
            }

            base.d = visiblePoints.length === 0 ? "" : d;

            if (dot <= 0.4) {
                base.setAttribute('fill-opacity', '0.4');
                base.setAttribute('stroke-opacity', '0.4');
            } else {
                base.setAttribute('fill-opacity', '0');
                base.setAttribute('stroke-opacity', '0.15');
            }
        };

        base.update();

        // Create the outline path
        let outline = group.path();
        outline.setAttribute('stroke', color);
        outline.setAttribute('fill', color);
        outline.setAttribute('fill-opacity', '0.25');
        outline.setAttribute('stroke-width', '1.5px');
        outline.setAttribute('stroke-opacity', '0.5');
        outline.addDependency(pos, apex, this.camera, this.camera.position);
        outline.update = () => {
            let u = pos;
            let a = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(apex));
            let b = this.camera.projectPoint(apex);
            let q = Quaternion.rotationToVector(u);
            let d = '';
            let visiblePoints = [];

            let max: [DOMPoint, number] = null;
            let min: [DOMPoint, number] = null;

            let startIndex = null;
            let endIndex = null;

            // Project all points of the circle base to 2D
            for (let j = 0; j < longs.length; j++) {
                let point = longs[j].copy().apply(q).add(u);
                let v = this.camera.projectPoint(point);
                if (v.z !== 0) {  // Skip points that can't be projected
                    let w = this.viewPort.plot.SVGToRelative(v);
                    visiblePoints.push(w);

                    let n = new Vector2(v.x - b.x, v.y - b.y);
                    let m = new Vector2(-b.x, -b.y);

                    let angle = Math.atan2(n.y * m.x - n.x * m.y, n.x * m.x + n.y * m.y);
                    if (max === null || max[1] < angle) {
                        max = [w, angle]
                        startIndex = j;
                    }

                    if (min === null || min[1] > angle) {
                        min = [w, angle];
                        endIndex = j;
                    }
                }
            }

            // Draw the circle outline
            if (max[1] - min[1] < Math.PI) {
                d += `M ${min[0].x} ${min[0].y} L ${a.x} ${a.y} L ${max[0].x} ${max[0].y}`;
                if (startIndex < endIndex) {
                    let i = startIndex;
                    d += `M ${visiblePoints[i].x.toFixed(2)} ${visiblePoints[i].y.toFixed(2)} `;
                    while (i <= endIndex) {
                        d += `L ${visiblePoints[i].x.toFixed(2)} ${visiblePoints[i].y.toFixed(2)} `;
                        i++;
                    }
                } else {
                    let j = startIndex;
                    d += `M ${visiblePoints[j].x.toFixed(2)} ${visiblePoints[j].y.toFixed(2)} `;
                    while (j <= endIndex + visiblePoints.length) {
                        d += `L ${visiblePoints[j % visiblePoints.length].x.toFixed(2)} ${visiblePoints[j % visiblePoints.length].y.toFixed(2)} `;
                        j++;
                    }

                    if (max[1] - min[1] >= Math.PI) {
                        d += `L ${visiblePoints[startIndex].x.toFixed(2)} ${visiblePoints[startIndex].y.toFixed(2)} `;
                    }
                }
            } else {
                // Draw the circle base
                if (visiblePoints.length > 0) {
                    d += `M ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
                    for (let i = 1; i < visiblePoints.length; i++) {
                        d += `L ${visiblePoints[i].x.toFixed(3)} ${visiblePoints[i].y.toFixed(3)} `;
                    }
                    d += `L ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
                }
            }

            outline.d = visiblePoints.length === 0 ? "" : d;
            // Adjust opacity based on the average dot product
            let dot = this.normal.dot(u);
            if (dot < 0) {
                group.setAttribute('opacity', Math.max(1 + 1.2 * dot, 0).toFixed(2));
            } else {
                group.setAttribute('opacity', '1');
            }
        };

        outline.update();

        group.appendChild(apexCircle)

        return group;
    }

    registerEventListeners(r = 2, invert = false) {

        r = 0.5;
        let isDragging = false;
        let isSpaceDown = false;
        let upAxis: 'x' | 'y' | 'z' = 'z';
        let prevX: number = 0;
        let prevY: number = 0;
        let bbox = this.viewPort.frame.root.getBoundingClientRect();

        // Store these variables in the class scope so they can be accessed by simulation methods
        this.isDragging = isDragging;
        this.prevX = prevX;
        this.prevY = prevY;

        // Use the class method for trackball projection
        const projectOnTrackball = (touchX: number, touchY: number) => {
            return this.projectOnTrackball(touchX, touchY, r, invert);
        }

        // Mouse down handler
        const handleMouseDown = (event: MouseEvent) => {
            if (this.viewPort.frame.root.contains(event.target as HTMLElement) && !this.disableEventListeners) {
                isDragging = true;
                this.q_copy.set(this.q);
                bbox = this.viewPort.frame.root.getBoundingClientRect();
                this.viewPort.plot.setCTM();
                this.viewPort.plot.setBoundingRect();
                prevX = event.clientX;
                prevY = event.clientY;
                let v1 = projectOnTrackball(prevX, prevY);
                let v2 = projectOnTrackball(prevX, prevY);
                this.p1.set(Quaternion.fromVector(v1));
                this.p2.set(Quaternion.fromVector(v2));

                this.rotationQuaternion.set(this.p2.multiply(this.p1.conjugate()).pow(0.5));
                this.q.set(this.rotationQuaternion.multiply(this.q_copy));
            }
        };

        // Mouse move handler
        const handleMouseMove = (event: MouseEvent) => {
            if (!this.disableEventListeners) {
                handleMouseMovement(event.clientX, event.clientY);
                event.preventDefault();
            }
        };

        // Function to handle mouse movement (used by both real events and simulation)
        const handleMouseMovement = (currentX: number, currentY: number) => {
            if (isDragging && (currentX !== prevX || currentY !== prevY)) {
                const v1 = projectOnTrackball(prevX, prevY);
                const v2 = projectOnTrackball(currentX, currentY);

                this.p1.set(Quaternion.fromVector(v1));
                this.p2.set(Quaternion.fromVector(v2));

                this.rotationQuaternion.set(this.p2.multiply(this.p1.conjugate()).pow(0.5));
                this.q.set(this.rotationQuaternion.multiply(this.q_copy));
            }
        };

        // Mouse up handler
        const handleMouseUp = () => {
            if (!this.disableEventListeners) {
                isDragging = false;
                this.viewPort.plot.releaseBoundingRect();
                this.viewPort.plot.releaseCTM();
            }
        };

        let scaleFactor = 1.1;

        // Keydown handler
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.camera.lookAt(this.origin, new Vector3(0, 0, -1));
                    break;
                case 'ArrowDown':
                    // Handle arrow down key
                    this.camera.lookAt(this.origin, new Vector3(0, 0, 1));
                    break;
                case 'ArrowLeft':
                    // Handle arrow left key
                    break;
                case 'ArrowRight':
                    // Handle arrow right key
                    break;
                case 'Enter':
                    console.log(this.q.toConstructor())
                    break;
                case '=':
                    this.camera.position.set(this.camera.position.scale(1 / scaleFactor));
                    // this.camera.position = this.camera.position.subtract(this.camera.position.normalize().copy());
                    this.camera.updateDependents();
                    break;
                case '-':
                    this.camera.position.set(this.camera.position.scale(scaleFactor));
                    // this.camera.position = this.camera.position.add(this.camera.position.normalize().copy());
                    this.camera.updateDependents();
                    break;
                case 'x':
                    upAxis = 'x';
                    this.camera.orientation.set(new Quaternion(1, 0, 0, 0).multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2)));
                    this.camera.position.set(new Vector3(0, 0, -this.camera.position.length()))
                    this.camera.orientation.updateDependents();
                    this.camera.position.updateDependents();
                    this.camera.updateDependents();


                    // this.camera.lookAt(this.origin, new Vector3(-1, 0, 0));
                    event.preventDefault();
                    break;
                case 'y':
                    upAxis = 'y';
                    this.camera.orientation.set(new Quaternion(1, 0, 0, 0));
                    this.camera.position.set(new Vector3(0, 0, -this.camera.position.length()))
                    this.camera.orientation.updateDependents();
                    this.camera.position.updateDependents();
                    this.camera.updateDependents();

                    // this.camera.lookAt(this.origin, new Vector3(0, -1, 0));
                    event.preventDefault();
                    break;
                case 'z':
                    upAxis = 'z';
                    // this.camera.orientation.set(new Quaternion(0, 0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
                    this.camera.orientation.set(new Quaternion(0, 0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2).multiply(new Quaternion(0, 0, 0, 1)));
                    this.camera.position.set(new Vector3(0, -this.camera.position.length(), 0));
                    this.camera.orientation.updateDependents();
                    this.camera.position.updateDependents();
                    this.camera.updateDependents();



                    // this.camera.orientation.set(Quaternion.identity());
                    // this.camera.position.set(new Vector(this.camera.position.length()))
                    event.preventDefault();
                    break;
                case ' ':
                    // Handle space bar
                    isSpaceDown = true;
                    event.preventDefault();
                    break;
                default:
                    // Handle other keys if necessary
                    break;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    break;
                case 'ArrowDown':
                    break;
                case 'ArrowLeft':
                    // Handle arrow left key
                    break;
                case 'ArrowRight':
                    // Handle arrow right key
                    break;
                case 'Enter':
                    break;
                case ' ':
                    // Handle space bar
                    isSpaceDown = false;
                    // switch (upAxis) {
                    //     case 'x':
                    //         upAxis = 'x';
                    //         this.camera.lookAt(this.origin, new Vector3(-1, 0, 0));
                    //         break;
                    //     case 'y':
                    //         upAxis = 'y';
                    //         this.camera.lookAt(this.origin, new Vector3(0, -1, 0));
                    //         break;
                    //     case 'z':
                    //         upAxis = 'z';
                    //         this.camera.lookAt(this.origin, new Vector3(0, 0, -1));
                    //         break;
                    // }
                    // event.preventDefault();
                    break;
                default:
                    // Handle other keys if necessary
                    break;
            }
        };

        // Attach event listeners
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

    }


    /**
     * Projects the coordinates onto the northern hemisphere of a sphere.
     */
    private projectOnTrackball(touchX: number, touchY: number, r: number = 0.5, invert: boolean = false): Vector3 {
        const bbox = this.viewPort.frame.root.getBoundingClientRect();
        
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
     * Handles mouse movement when the mouseCurrent Point is updated
     */
    private handleMouseMovement() {
        if (this.isDragging) {
            // Use starting position as p1 and current position as p2 (like real mouse events)
            const v1 = this.projectOnTrackball(this.startingMousePosition.x, this.startingMousePosition.y);
            const v2 = this.projectOnTrackball(this.mousePosition.x, this.mousePosition.y);

            // Update quaternions and apply rotation
            this.p1.set(Quaternion.fromVector(v1));
            this.p2.set(Quaternion.fromVector(v2));
            this.rotationQuaternion.set(this.p2.multiply(this.p1.conjugate()).pow(0.5));
            this.q.set(this.rotationQuaternion.multiply(this.q_copy));
        }
    }

    /**
     * Sets the starting position for mouse simulation
     * @param x - X coordinate in screen space
     * @param y - Y coordinate in screen space
     */
    setStartingPosition(x: number, y: number) {
        this.startingMousePosition.moveTo(x, y);
        this.mouse.moveTo(x, y);
        this.mousePosition.moveTo(x, y);
    }

    /**
     * Enables mouse simulation (equivalent to starting a drag)
     */
    enableMouseSimulation() {
        this.isDragging = true;
        this.q_copy.set(this.q);
        this.viewPort.plot.setCTM();
        this.viewPort.plot.setBoundingRect();
    }

    /**
     * Disables mouse simulation (equivalent to stopping a drag)
     */
    disableMouseSimulation() {
        this.isDragging = false;
        this.viewPort.plot.releaseBoundingRect();
        this.viewPort.plot.releaseCTM();
    }

}