import { Circle, Group, interpolateColor, Line, Path, Quaternion, Tex, Value, Vector2, Vector3 } from "../../vector/src";
import { QScene } from "../QScene";


export class TransformScene extends QScene {

    left: Quaternion;
    right: Quaternion;
    cube: Group;
    
    // Basis vectors as instance variables
    i: Quaternion;
    j: Quaternion;
    k: Quaternion;
    axis: Vector3;
    topFacePath: Path;
    cubeRotation: Quaternion;
    displayAxis: Group;
    qTex: Tex;

    constructor() {

        super({
            // cameraPosition: new Vector3(4.774, -3.077, 4.093).scale(-0.5),
            cameraOrientation: new Quaternion(1, 0,0,0), 
            cameraPosition: new Vector3(0, 0, -3.667),
            drawAxes: false,
            labelAxes: false,
            drawBasisVectors: false,
            showQuaternionTex: false,
        });

        let a = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI/4);
        let b = Quaternion.fromAxisAngle(new Vector3(-1, 1, 0), Math.acos(1/Math.sqrt(3)));

        this.cubeRotation = Quaternion.identity();
        this.cubeRotation.set(b.multiply(a));
        this.cubeRotation.addDependency(a, b);
        this.cubeRotation.update = () => {
            this.cubeRotation.set(b.multiply(a));
        }
        this.cubeRotation.update();
        
        let angle = new Value(Math.PI/2);
        let sineOfAngle = Math.sin(angle.value);
        // let axis = new Vector3(1, 1, 1).normalize();
        this.axis = this.cubeRotation.transform(new Vector3(0, 0, 1));
        this.axis.addDependency(this.cubeRotation);
        this.axis.update = () => {
            this.axis.set(this.cubeRotation.transform(new Vector3(0, 0, 1)));
        }
        this.axis.update();

        this.left = new Quaternion(1, 0, 0, 0);
        this.right = new Quaternion(1, 0, 0, 0);
        this.q.addDependency(this.left);
        this.q.update = () => {
            this.q.set(this.left);
        }
        this.q.update();

        let thetaAsNumber = false;

        this.qTex = this.viewPort.frame.tex('');
        this.qTex.setAttribute('font-size', '18px');
        this.qTex.moveTo(this.viewPort.frame.width / 2, 50)
        this.qTex.addDependency(this.left);
        this.qTex.update = () => {
        
            let thetaValue = Math.acos(this.left.w);
            // If x is negative, we need to add π to get the correct angle in [0, 2π]
            if (this.left.x < 0) {
                thetaValue = 2 * Math.PI - thetaValue;
            }

            let thetaString = thetaAsNumber ? thetaValue.toFixed(2) : '\\theta';

            this.qTex.replace('q=' + `\\cos (${thetaString})+\\sin (${thetaString}) \\frac{(1 i+1 j+1 k)}{\\sqrt{3}} `);
            this.qTex.setColorAll(thetaString, '#72D6BF');
            this.qTex.setColorAll(' \\frac{(1 i+1 j+1 k)}{\\sqrt{3}}', 'var(--pink)');
            this.qTex.alignCenter();
        }
        this.qTex.update();

        // Initialize basis vectors
        this.initializeBasisVectors();


        this.displayAxis = this.viewPort.frame.group();
        this.displayAxis.appendChild(this.vector(this.origin, this.axis, 'var(--pink)'));
        // this.axisVector = this.drawStaticConeWithLine(0.075, this.axis, 'var(--pink)');
        // this.axisVector.setOpacity(0.5);

        this.cube = this.drawCube2(this.cubeRotation, true);

        let r = new Quaternion(
            Math.cos(angle.value),
            this.axis.x * sineOfAngle,
            this.axis.y * sineOfAngle,
            this.axis.z * sineOfAngle
        );

    }

    visualizeVector(q: Quaternion) : Line {
        this.orientQ(q);
        return this.vectorQ(q);
    }

    initializeBasisVectors() {
        // Create basis vectors
        this.i = new Quaternion(0, 1, 0, 0);
        this.j = new Quaternion(0, 0, 1, 0);
        this.k = new Quaternion(0, 0, 0, 1);

        // Orient them using the orientQ method
        this.orientQ(this.i);
        this.orientQ(this.j);
        this.orientQ(this.k);

        // Draw them as vectors
        this.vectorQ(this.i, 'var(--red)', 1);
        this.vectorQ(this.j, 'var(--green)', 1);
        this.vectorQ(this.k, 'var(--blue)', 1);
    }

    orientQ(q: Quaternion) {
        let q_copy = q.copy();
        q.addDependency(this.left, this.right);
        q.update = () => {
            // q.set(this.left.inverse().multiply(q_copy).multiply(this.right.inverse()));
            q.set(this.left.multiply(q_copy).multiply(this.right.inverse()));
        }
        q.update();
        return q;
    }

    visualizePoint(point: Quaternion, rotation: Quaternion): Quaternion {
        // Apply 3D rotation
        let rotated = rotation.multiply(point).multiply(rotation.inverse());
        // Apply visualization transformation
        return this.left.multiply(rotated).multiply(this.right.inverse());
    }

    pointQ(q: Quaternion, color: string = 'var(--font-color)', opacity = 1): Circle {

        let v = q.toVector3();
        v.addDependency(q);
        v.update = () => {
            v.set(q.toVector3());
        }
        v.update();

        return this.drawPoint(v)
    }

    vectorQ(q:Quaternion, color: string = 'var(--font-color)', opacity = 1): Line {

        let origin = new Vector3(0, 0, 0);

        let v = q.toVector3();
        v.addDependency(q);
        v.update = () => {
            v.set(q.toVector3());
        }
        v.update();

        let l = this.viewPort.frame.line(0, 0, 0, 0)
        l.setAttribute('stroke', color);
        l.setAttribute('opacity', opacity.toString());
        l.setAttribute('stroke-width', '1.5px');
        l.attatchArrow(this.viewPort.defs, false, color);

        l.addDependency(origin, v, this.camera);
        l.update = () => {
            let t1 = this.camera.projectPoint(origin);
            let t2 = this.camera.projectPoint(v);

            let p1 = this.viewPort.plot.SVGToRelative(t1.x, t1.y);
            let p2 = this.viewPort.plot.SVGToRelative(t2.x, t2.y);

            l.x1 = p1.x;
            l.y1 = p1.y;
            l.x2 = p2.x;
            l.y2 = p2.y;
        }
        l.update();

        return l;
    }

    drawCube2(r: Quaternion = Quaternion.identity(), drawTopFace = false, color: string = 'var(--font-color)') {

        // Create cube vertices as quaternions (centered at origin, side length 2)
        const cubeVertices = [
            new Quaternion(0, 1, 1, 1),    // (0,1,1,1)
            new Quaternion(0, -1, 1, 1),   // (0,-1,1,1)
            new Quaternion(0, -1, -1, 1),  // (0,-1,-1,1)
            new Quaternion(0, 1, -1, 1),   // (0,1,-1,1)
            new Quaternion(0, 1, 1, -1),   // (0,1,1,-1)
            new Quaternion(0, -1, 1, -1),  // (0,-1,1,-1)
            new Quaternion(0, -1, -1, -1), // (0,-1,-1,-1)
            new Quaternion(0, 1, -1, -1)   // (0,1,-1,-1)
        ];
        let scale = 0.75;

        // Create projected vertices
        const projectedVertices = cubeVertices.map(q => {
            let q_copy = q.normalize().scale(scale);
            q.addDependency(this.left, this.right, r);
            q.update = () => {
                // Apply visualization using the overridable method
                q.set(this.visualizePoint(q_copy, r));
            }
            q.update();
            return q;
        });
    
        // Define edges of the cube
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // front face
            [4, 5], [5, 6], [6, 7], [7, 4], // back face
            [0, 4], [1, 5], [2, 6], [3, 7]  // connecting edges
        ];

        // Number of segments per edge
        const numSegments = 16;

        // Draw segmented edges
        let group = this.viewPort.frame.group();
        
        // Add filled top face
        let topFacePath = group.path('');
        topFacePath.setAttribute('fill', color);
        topFacePath.setAttribute('fill-opacity', '0.25');
        topFacePath.setAttribute('stroke', 'none');
        
        // Create dependent vectors for top face vertices
        if( drawTopFace ) {
            let topVertices = [0, 1, 2, 3].map(i => {
                let v = projectedVertices[i].toVector3();
                v.addDependency(projectedVertices[i]);
                v.update = () => {
                    v.set(projectedVertices[i].toVector3());
                }
                v.update();
                v.addDependency(this.camera);
                return v;
            });
            
            topFacePath.addDependency(...topVertices);
            topFacePath.update = () => {
                // Project all top face vertices to 2D
                let projectedPoints = topVertices.map(v => {
                    let projected = this.camera.projectPoint(v);
                    return this.viewPort.plot.SVGToRelative(projected.x, projected.y);
                });
                
                // Create path data for the top face
                let pathData = `M ${projectedPoints[0].x} ${projectedPoints[0].y}`;
                for (let i = 1; i < projectedPoints.length; i++) {
                    pathData += ` L ${projectedPoints[i].x} ${projectedPoints[i].y}`;
                }
                pathData += ' Z'; // Close the path
                
                topFacePath.d = pathData;

                // let one = this.left.multiply(new Quaternion(1, 0, 0, 0)).multiply(this.right.inverse());
                // let axis = new Vector3(1, 1, 1).normalize();
                // let dot = one.toVector3().dot(axis)
                // if( dot > 0 ) {
                //     topFacePath.setAttribute('fill', interpolateColor('var(--font-color)', 'var(--purple)', dot));
                // } else {
                //     topFacePath.setAttribute('fill', interpolateColor('var(--font-color)', 'var(--yellow)', Math.abs(dot)));
                // }
                // topFacePath.setAttribute('fill', '0.25');
            }
            topFacePath.update();
        }
        this.topFacePath = topFacePath;
        
        edges.forEach(([i, j]) => {
            let start = projectedVertices[i].toVector3();
            let end = projectedVertices[j].toVector3();
            
            start.addDependency(projectedVertices[i])
            start.update = () => {
                start.set(projectedVertices[i].toVector3());
            }
            start.update();
            
            end.addDependency(projectedVertices[j])
            end.update = () => {
                end.set(projectedVertices[j].toVector3());
            }
            end.update();

            // Create segments along the edge
            for (let seg = 0; seg < numSegments; seg++) {
                const t1 = seg / numSegments;
                const t2 = (seg + 1) / numSegments;
                
                let segStart = new Vector3(0, 0, 0);
                let segEnd = new Vector3(0, 0, 0);
                
                segStart.addDependency(start, end);
                segStart.update = () => {
                    segStart.set(start.scale(1 - t1).add(end.scale(t1)));
                }
                segStart.update();
                
                segEnd.addDependency(start, end);
                segEnd.update = () => {
                    segEnd.set(start.scale(1 - t2).add(end.scale(t2)));
                }
                segEnd.update();

                segStart.addDependency(this.camera);
                segEnd.addDependency(this.camera);

                let l = group.line(0, 0, 0, 0)
                l.setAttribute('stroke', color);
                l.setAttribute('opacity', `${0.5}`);

                // Stroke width effect control variables
                let baseDistance = 3.667;        // Distance at which stroke width is minimum
                let strokeScaleFactor = 5;   // How dramatic the scaling is (higher = more dramatic)
                let minStrokeWidth = 1.5;    // Minimum stroke width in pixels
                let maxStrokeWidth = 3;      // Maximum stroke width in pixels

                // Opacity effect control variables
                let minOpacity = 0.3;        // Minimum opacity (far edges)
                let maxOpacity = 0.75;        // Maximum opacity (near edges)
                let opacityScaleFactor = 0.5; // How dramatic the opacity change is


                l.addDependency(segStart, segEnd,);
                l.update = () => {
                    let t1 = this.camera.projectPoint(segStart);
                    let t2 = this.camera.projectPoint(segEnd);

                    let p1 = this.viewPort.plot.SVGToRelative(t1.x, t1.y);
                    let p2 = this.viewPort.plot.SVGToRelative(t2.x, t2.y);

                    l.x1 = p1.x;
                    l.y1 = p1.y;
                    l.x2 = p2.x;
                    l.y2 = p2.y;
                    
                    // Calculate stroke width based on distance from camera
                    let d1 = segStart.subtract(this.camera.position).length();
                    let d2 = segEnd.subtract(this.camera.position).length();
                    let avgDistance = (d1 + d2) * 0.5;
                    let strokeWidth = Math.max(minStrokeWidth, Math.min(maxStrokeWidth, (avgDistance - baseDistance) * strokeScaleFactor));
                    
                    // Calculate opacity based on distance from camera
                    let opacity = Math.max(minOpacity, Math.min(maxOpacity, maxOpacity - (baseDistance - avgDistance) * opacityScaleFactor));
                    l.setAttribute('stroke-width', strokeWidth.toString());
                    l.setAttribute('opacity', opacity.toString());
                }
                l.update();
            }
        });
        return group;
    }

    drawStaticConeWithLine(radius: number, pos: Vector3 = new Vector3(0, 0, 1), color: string): Group {
        let apexHeight = radius * 2.5;
        let longs = this.generateCircle(72, radius);
        let group = this.viewPort.frame.group();

        let apex = new Vector3();
        apex.addDependency(pos);
        apex.update = () => {
            apex.set(pos);
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
            let u = pos.subtract(pos.normalize().scale(apexHeight));
            let q = Quaternion.rotationToVector(pos);
            let d = '';
            let visiblePoints = [];
            let allPoints = [];

            // Project all points of the circle base to 2D
            for (let j = 0; j < longs.length; j++) {
                let point = longs[j].copy().apply(q).add(u);
                let v = this.camera.projectPoint(point);
                let w = this.viewPort.plot.SVGToRelative(v);
                if (v.z !== 0) {  // Skip points that can't be projected
                    visiblePoints.push(w);
                }
                allPoints.push(w);
            }

            let dot = this.normal.dot(u.normalize());
            let epsilon = 0.45;

            if (dot < epsilon) {
                base.setAttribute('stroke-opacity', '0.5');
            } else {
                base.setAttribute('stroke-opacity', '0.15');
            }

            // Always draw the circle base
            if (visiblePoints.length > 0) {
                d += `M ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
                for (let i = 1; i < visiblePoints.length; i++) {
                    d += `L ${visiblePoints[i].x.toFixed(3)} ${visiblePoints[i].y.toFixed(3)} `;
                }
                d += `L ${visiblePoints[0].x.toFixed(3)} ${visiblePoints[0].y.toFixed(3)} `;
            }



            base.d = visiblePoints.length === 0 ? "" : d;
        };

        base.update();

        // Add line from origin to base center
        let baseLine = group.line(0, 0, 0, 0);
        baseLine.setAttribute('stroke', color);
        baseLine.setAttribute('stroke-width', '1.5px');
        baseLine.setAttribute('stroke-opacity', '0.5');
        baseLine.addDependency(pos, this.camera, this.camera.position);
        baseLine.update = () => {
            let baseCenter = pos.subtract(pos.normalize().scale(apexHeight));
            let origin2D = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(this.origin));
            let baseCenter2D = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(baseCenter));
            
            baseLine.x1 = origin2D.x;
            baseLine.y1 = origin2D.y;
            baseLine.x2 = baseCenter2D.x;
            baseLine.y2 = baseCenter2D.y;
        };
        baseLine.update();

        // Create the outline path
        let outline = group.path();
        outline.setAttribute('stroke', color);
        outline.setAttribute('fill', color);
        outline.setAttribute('fill-opacity', '0.25');
        outline.setAttribute('stroke-width', '1.5px');
        outline.setAttribute('stroke-opacity', '0.5');
        outline.addDependency(pos, apex, this.camera, this.camera.position);
        outline.update = () => {
            let u = pos.subtract(pos.normalize().scale(apexHeight));
            let a = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(apex));
            let b = this.camera.projectPoint(apex);
            let q = Quaternion.rotationToVector(pos);
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

            let dot = this.normal.dot(u.normalize());

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
            } else if ( dot > 0 ) {
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
        };

        outline.update();

        group.appendChild(apexCircle)

        return group;
    }

}