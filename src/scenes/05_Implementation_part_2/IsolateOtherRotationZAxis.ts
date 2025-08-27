import { Line, Quaternion, Scene3D, Vector3 } from "../../vector/src";
import { QScene, QSceneConfig } from "../QScene";


export interface IsolateOtherRotationConfig extends QSceneConfig {
    axis: Vector3;
}

export class IsolateOtherRotation extends QScene {


    left: Quaternion;
    right: Quaternion;

    constructor(config: IsolateOtherRotationConfig) {

        let defaultConfig: IsolateOtherRotationConfig = {
            axis: new Vector3(1, 1, 1).normalize(),
        }

        config = {
            ...defaultConfig,
            ...config,
        }

        super({
            cameraPosition: new Vector3(4.774, -3.077, 4.093).scale(-0.75),
            drawAxes: false,
            labelAxes: false,
            drawBasisVectors: false,
        });

        this.left = new Quaternion(1, 0, 0, 0);
        this.right = new Quaternion(1, 0, 0, 0);
        this.q.addDependency(this.left);
        this.q.update = () => {
            this.q.set(this.left);
        }
        this.q.update();


        // this.orient(this.positiveX);
        // this.orient(this.positiveY);
        // this.orient(this.positiveZ);

        // let origin = new Vector3(0, 0, 0);
        // this.vector(origin, this.positiveX, 'var(--red)', 1);
        // this.vector(origin, this.positiveY, 'var(--green)', 1);
        // this.vector(origin, this.positiveZ, 'var(--blue)', 1);

        let one = new Quaternion(1, 0, 0, 0);
        let i = new Quaternion(0, 1, 0, 0);
        let j = new Quaternion(0, 0, 1, 0);
        let k = new Quaternion(0, 0, 0, 1);

        this.orientQ(one);
        this.orientQ(i);
        this.orientQ(j);
        this.orientQ(k);

        this.vectorQ(one, 'var(--yellow)', 1);
        this.vectorQ(i, 'var(--red)', 1);
        this.vectorQ(j, 'var(--green)', 1);
        this.vectorQ(k, 'var(--blue)', 1);

        // Draw both the hypercube and regular cube
        // this.drawHypercube();
        this.cube(new Quaternion(1, 0, 0, 0));
        // this.cube(new Quaternion(0, 1, 0, 0));
        // this.cube(new Quaternion(0, 0, 1, 0));
        // this.cube(new Quaternion(0, 0, 0, 1));

        let angle = Math.PI/2;
        let sineOfAngle = Math.sin(angle);
        let axis = config.axis;
        let r = new Quaternion(
            Math.cos(angle),
            axis.x * sineOfAngle,
            axis.y * sineOfAngle,
            axis.z * sineOfAngle
        );

        // let iVec = this.toDependentVector(i);
        // let iTex = this.viewPort.frame.tex(iVec.toFormattedString(), 100, 100);
        // iTex.addDependency(iVec);
        // iTex.update = () => {
        //     iTex.replace(iVec.length().toString());
        // }
        // iTex.update();
        // this.vector(this.origin, axis, 'var(--pink)', 1);

        this.play([
            this.left.animate.rotateBy(r),
        ], 5, "linear")

        this.play([
            this.left.animate.rotateBy(r),
            this.right.animate.rotateBy(r),
        ], 5, "linear")

        this.play([
            this.left.animate.rotateBy(r),
            this.right.animate.rotateBy(r),
        ], 5, "linear") 
        
        this.play([
            this.left.animate.rotateBy(r),
            this.right.animate.rotateBy(r),
        ], 5, "linear") 

    }

    orientQ(q: Quaternion) {
        let q_copy = q.copy();
        q.addDependency(this.left, this.right);
        q.update = () => {
            // q.set(this.left.inverse().multiply(q_copy).multiply(this.right.inverse()));
            q.set(this.left.multiply(q_copy));
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

    drawHypercube() {
        // Create hypercube vertices as quaternions (centered at origin, side length 2)
        const hypercubeVertices = [
            // w = 1
            new Quaternion(1, 1, 1, 1),    // (1,1,1,1)
            new Quaternion(1, -1, 1, 1),   // (1,-1,1,1)
            new Quaternion(1, -1, -1, 1),  // (1,-1,-1,1)
            new Quaternion(1, 1, -1, 1),   // (1,1,-1,1)
            new Quaternion(1, 1, 1, -1),   // (1,1,1,-1)
            new Quaternion(1, -1, 1, -1),  // (1,-1,1,-1)
            new Quaternion(1, -1, -1, -1), // (1,-1,-1,-1)
            new Quaternion(1, 1, -1, -1),  // (1,1,-1,-1)
            // w = -1
            new Quaternion(-1, 1, 1, 1),    // (-1,1,1,1)
            new Quaternion(-1, -1, 1, 1),   // (-1,-1,1,1)
            new Quaternion(-1, -1, -1, 1),  // (-1,-1,-1,1)
            new Quaternion(-1, 1, -1, 1),   // (-1,1,-1,1)
            new Quaternion(-1, 1, 1, -1),   // (-1,1,1,-1)
            new Quaternion(-1, -1, 1, -1),  // (-1,-1,1,-1)
            new Quaternion(-1, -1, -1, -1), // (-1,-1,-1,-1)
            new Quaternion(-1, 1, -1, -1)   // (-1,1,-1,-1)
        ];

        // Create projected vertices
        const projectedVertices = hypercubeVertices.map(q => {
            return this.orientQ(q.normalize());
        });

        // Define edges of the hypercube
        const edges = [
            // Cube 1 (w=1)
            [0, 1], [1, 2], [2, 3], [3, 0], // front face
            [4, 5], [5, 6], [6, 7], [7, 4], // back face
            [0, 4], [1, 5], [2, 6], [3, 7], // connecting edges
            // Cube 2 (w=-1)
            [8, 9], [9, 10], [10, 11], [11, 8], // front face
            [12, 13], [13, 14], [14, 15], [15, 12], // back face
            [8, 12], [9, 13], [10, 14], [11, 15], // connecting edges
            // Connecting edges between cubes
            [0, 8], [1, 9], [2, 10], [3, 11],
            [4, 12], [5, 13], [6, 14], [7, 15]
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
            // Color the w=1 cube (first 8 vertices) in yellow, others in white
            const color = (i < 8 && j < 8) ? 'var(--yellow)' : 'white';
            let line = this.line(start, end, color, 0.5);
            line.setAttribute('stroke-width', '1.5px');
        });
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
            return this.orientQ(r.multiply(q).normalize());
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
            let line = this.line(start, end, 'var(--purple)', 0.5);
            line.setAttribute('stroke-width', '1.5px');
        });
    }

}