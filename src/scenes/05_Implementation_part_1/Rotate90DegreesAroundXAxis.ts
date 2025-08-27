import { Quaternion, Vector3 } from "../../vector/src";
import { SphereScene } from "../SphereScene";

export class Rotate90DegreesAroundXAxis extends SphereScene {

    constructor() {

        super({
            drawAxes: false,
            cameraPosition: new Vector3(0, 0, -5.5)
        });

        this.labelBasisVectors();

        // let q = new Quaternion(0.83, 0.34, -0.44, 0.02).normalize();
        let q = Quaternion.identity();
        let r = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), Math.PI/2)

        this.q.set(q)

        this.reset = () => {
            this.clear();
            this.wait();
            this.play([
                this.q.animate.rotateBy(r)
            ], 3)

            this.wait();
 
        }
        this.reset();
    }

}