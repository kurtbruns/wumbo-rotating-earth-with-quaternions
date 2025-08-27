import { Quaternion, Vector3 } from "../../vector/src";
import { SphereScene } from "../SphereScene";

export class CombinedRotationsOtherWay extends SphereScene {

    constructor() {
        super({
            drawAxes: false,
            cameraPosition: new Vector3(0, 0, -5.5)
        });

        this.labelBasisVectors();

        let q = Quaternion.identity();
        let r1 = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), Math.PI/2);
        let r2 = Quaternion.fromAxisAngle(new Vector3(1, 1, 1), -2*Math.PI/3);

        this.q.set(q);

        this.reset = () => {
            this.clear();
            this.wait()
            this.play([
                this.q.animate.rotateBy(r2),
            ], 3);
            this.wait(0.5);
            this.play([
                this.q.animate.rotateBy(r1),
            ], 3);
            this.wait();
        }
        this.reset();
    }
} 