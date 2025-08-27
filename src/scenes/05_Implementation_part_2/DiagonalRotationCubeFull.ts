import { interpolateColor, Line, Quaternion, Scene3D, Vector3 } from "../../vector/src";
import { QScene, QSceneConfig } from "../QScene";



export class DiagonalRotationCubeFull extends QScene {

    left: Quaternion;
    right: Quaternion;
    axisQuat: Quaternion;

    constructor() {

        super({
            // cameraPosition: new Vector3(4.774, -3.077, 4.093).scale(-0.5),
            cameraOrientation: new Quaternion(1, 0,0,0), 
            cameraPosition: new Vector3(0, 0, -4),
            drawAxes: false,
            labelAxes: false,
            drawBasisVectors: false,
        });

        let f2 = this.viewPort.frame.tex('f(p) = q \\cdot p \\cdot q^{-1}').alignCenter();
        f2.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50)
    
        
        let angle = Math.PI/3;
        let sineOfAngle = Math.sin(angle);
        let axis = new Vector3(1, 1, 1).normalize();
        this.vector(this.origin, axis.scale(1), interpolateColor('var(--font-color)', 'var(--background)', 0.25));

        this.left = new Quaternion(1, 0, 0, 0);
        this.right = new Quaternion(1, 0, 0, 0);
        this.q.addDependency(this.left);
        this.q.update = () => {
            this.q.set(this.left);
        }
        this.q.update();

        let one = new Quaternion(1, 0, 0, 0);
        let i = new Quaternion(0, 1, 0, 0);
        let j = new Quaternion(0, 0, 1, 0);
        let k = new Quaternion(0, 0, 0, 1);

        this.orientQ(one);
        this.orientQ(i);
        this.orientQ(j);
        this.orientQ(k);

        // this.vectorQ(one, 'var(--yellow)', 1);
        this.vectorQ(i, 'var(--red)', 1);
        this.vectorQ(j, 'var(--green)', 1);
        this.vectorQ(k, 'var(--blue)', 1);


        let a = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI/4);
        let b = Quaternion.fromAxisAngle(new Vector3(-1, 1, 0), Math.acos(1/Math.sqrt(3)));

        let cubeRotation = Quaternion.identity();
        let cube = this.cube2(cubeRotation, true);

        let r = new Quaternion(
            Math.cos(angle),
            axis.x * sineOfAngle,
            axis.y * sineOfAngle,
            axis.z * sineOfAngle
        );

        cubeRotation.set(b.multiply(a)),

        this.reset = () => {
            this.clear();

            this.play([
                this.left.animate.rotateBy(r),
                this.right.animate.rotateBy(r),
            ], 5, "linear")

    
        }
        this.reset();

    }

    orientQ(q: Quaternion) {
        let q_copy = q.copy();
        q.addDependency(this.left, this.right);
        q.update = () => {
            q.set(this.left.multiply(q_copy).multiply(this.right.inverse()));
        }
        q.update();
        return q;
    }

    toDependentVector(q: Quaternion) {
        let v = q.toVector3();
        v.addDependency(q);
        v.update = () => {
            v.set(q.toVector3());
        }
        return v;
    }

    orient(v: Vector3) {
        let v_copy = v.copy();
        v.addDependency(this.left, this.right);
        v.update = () => {
            v.set(this.left.inverse().multiply(new Quaternion(0, v_copy.x, v_copy.y, v_copy.z)).multiply(this.right.inverse()).toVector3());
        }
        v.update();
        return v;
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

    cube(r: Quaternion = Quaternion.identity()) {
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

        // Create projected vertices
        const projectedVertices = cubeVertices.map(q => {

            let q_copy = q.normalize();
            q.addDependency(this.left, this.right, r);
            q.update = () => {

                // Apply 3D rotation
                let a = r.multiply(q_copy).multiply(r.inverse());

                // Apply visualized
                q.set(this.left.multiply(a).multiply(this.right.inverse()));
            }
            q.update();
            return q;

            // return this.orientQ(q.normalize().scale(0.5));
        });
    
        // Define edges of the cube
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // front face
            [4, 5], [5, 6], [6, 7], [7, 4], // back face
            [0, 4], [1, 5], [2, 6], [3, 7]  // connecting edges
        ];

        // Draw edges
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

            start.addDependency(this.camera);
            end.addDependency(this.camera);
    
            let l = this.viewPort.frame.line(0, 0, 0, 0)
            l.setAttribute('stroke', 'var(--purple)');
            l.setAttribute('opacity', `${0.5}`);
            l.setAttribute('stroke-width', '1.5px');
            
            l.addDependency(start, end);
            l.update = () => {
                let t1 = this.camera.projectPoint(start);
                let t2 = this.camera.projectPoint(end);
    
                let p1 = this.viewPort.plot.SVGToRelative(t1.x, t1.y);
                let p2 = this.viewPort.plot.SVGToRelative(t2.x, t2.y);
    
                l.x1 = p1.x;
                l.y1 = p1.y;
                l.x2 = p2.x;
                l.y2 = p2.y;

                let d0 = new Vector3(0, 0, 0).subtract(this.camera.position);
                let d1 = start.subtract(this.camera.position);
                let d2 = end.subtract(this.camera.position);
                let midpoint = start.add(end).scale(0.5);
                let d = midpoint.subtract(this.camera.position).length();
                let minDistance = Math.min(d1.length(), d2.length());
                let strokeWidth = Math.max(1, minDistance * 0.75);
                l.setAttribute('stroke-width', strokeWidth.toString());
   
            }
            l.update();

            // let line = this.line(start, end, 'var(--purple)', 0.5);
            // line.setAttribute('stroke-width', strokeWidth.toString());
        });
    }

    cube2(r: Quaternion = Quaternion.identity(), drawTopFace = false) {
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

        // Create projected vertices
        const projectedVertices = cubeVertices.map(q => {
            let q_copy = q.normalize();
            q.addDependency(this.left, this.right, r);
            q.update = () => {
                // Apply 3D rotation
                let a = r.multiply(q_copy).multiply(r.inverse());
                // Apply visualized
                q.set(this.left.multiply(a).multiply(this.right.inverse()));
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
        topFacePath.setAttribute('fill', 'var(--purple)');
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
            }
            topFacePath.update();
        }
        
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
                l.setAttribute('stroke', 'var(--purple)');
                l.setAttribute('opacity', `${0.5}`);

                // Stroke width effect control variables
                let baseDistance = 4;        // Distance at which stroke width is minimum
                let strokeScaleFactor = 5;   // How dramatic the scaling is (higher = more dramatic)
                let minStrokeWidth = 1.5;    // Minimum stroke width in pixels
                let maxStrokeWidth = 3;      // Maximum stroke width in pixels

                // Opacity effect control variables
                let minOpacity = 0.3;        // Minimum opacity (far edges)
                let maxOpacity = 0.75;        // Maximum opacity (near edges)
                let opacityScaleFactor = 0.5; // How dramatic the opacity change is


                l.addDependency(segStart, segEnd);
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

    rhombus() {
        // Create rhombus vertices using the basis vectors
        const vertices = [
            this.orientQ(new Quaternion(0, 1, 0, 0)),  // i
            this.orientQ(new Quaternion(0, -1, 0, 0)), // -i
            this.orientQ(new Quaternion(0, 0, 1, 0)),  // j
            this.orientQ(new Quaternion(0, 0, -1, 0)), // -j
            this.orientQ(new Quaternion(0, 0, 0, 1)),  // k
            this.orientQ(new Quaternion(0, 0, 0, -1))  // -k
        ];

        // Define edges of the rhombus
        const edges = [
            [0, 2], [0, 3], [0, 4], [0, 5], // from i
            [1, 2], [1, 3], [1, 4], [1, 5], // from -i
            [2, 4], [2, 5], [3, 4], [3, 5]  // remaining edges
        ];

        // Draw edges
        edges.forEach(([i, j]) => {
            let start = vertices[i].toVector3();
            let end = vertices[j].toVector3();
            start.addDependency(vertices[i])
            start.update = () => {
                start.set(vertices[i].toVector3());
            }
            start.update();
            end.addDependency(vertices[j])
            end.update = () => {
                end.set(vertices[j].toVector3());
            }
            end.update();
            let line = this.line(start, end, 'var(--orange)', 0.5);
            line.setAttribute('stroke-width', '1.5px');
        });
    }

    cubeFromOrigin(r: Quaternion = Quaternion.identity()) {
        // Create cube vertices as quaternions (corner at origin, side length 1)
        const cubeVertices = [
            new Quaternion(0, 0, 0, 0),     // (0,0,0)
            new Quaternion(0, 1, 0, 0),     // (1,0,0)
            new Quaternion(0, 1, 1, 0),     // (1,1,0)
            new Quaternion(0, 0, 1, 0),     // (0,1,0)
            new Quaternion(0, 0, 0, 1),     // (0,0,1)
            new Quaternion(0, 1, 0, 1),     // (1,0,1)
            new Quaternion(0, 1, 1, 1),     // (1,1,1)
            new Quaternion(0, 0, 1, 1)      // (0,1,1)
        ];

        // Create projected vertices
        const projectedVertices = cubeVertices.map(q => {
            return this.orientQ(r.multiply(q));
        });
    
        // Define edges of the cube
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // bottom face
            [4, 5], [5, 6], [6, 7], [7, 4], // top face
            [0, 4], [1, 5], [2, 6], [3, 7]  // connecting edges
        ];

        // Draw edges
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
            let line = this.line(start, end, 'var(--purple)', 0.5);
            line.setAttribute('stroke-width', '1.5px');
        });
    }

}