import { Quaternion, Vector3 } from "../../vector/src";
import { SphereScene } from "../SphereScene";

export class Rotate90DegreesAroundYAxis extends SphereScene {

    constructor() {

        super({
            drawAxes: true,
            size: 1.5,
            cameraPosition: new Vector3(0, 0, -5.5)
        });

        this.labelBasisVectors();

        // let q = Quaternion.identity();
        let q = new Quaternion(0.83, 0.34, -0.44, 0.02).normalize();
        // let q = new Quaternion(0.94, -0.09, -0.18, 0.26).normalize();
        let r1 = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), -Math.PI/12)
        let r2 = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI/2)
        // let r = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI/2)
        // this.q.set(r1.multiply(q))
        this.q.set(q)

        this.reset = () => {
            this.clear();

            this.wait();
            
            this.play([
                this.q.animate.rotateBy(r2)
            ], 4)

            this.wait(3)
 
        }
        this.reset();


    }

    // TODO:
    drawPlane(v:Vector3) {

        let path = this.viewPort.frame.path();
        path.setAttribute('stroke', 'var(--medium)');
        path.setAttribute('fill', 'var(--faint)');

        path.addDependency(v);
        path.update = () => {
            
            let d = '' // TODO: svg path string
 
            // TODO: draw plane 

            path.d = d;

        }


    }



}