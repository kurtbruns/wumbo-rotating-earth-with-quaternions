import { Quaternion, Vector3 } from '@kurtbruns/vector';
import { SphereScene } from "../SphereScene";

export class QuaternionsSetup extends SphereScene {

    constructor() {

        super({
            drawAxes: false,
            size: 1.5,
            cameraPosition: new Vector3(0, 0, -5.5)
        });

        this.labelBasisVectors();

        // this.q.set(new Quaternion(0.83, 0.34, -0.44, 0.02).normalize())
        this.q.set(new Quaternion(0.8987, 0.2547, 0.2760, -0.2264))

        this.reset = () => {
            this.clear();
            this.wait();
            this.play([
                this.q.animate.slerp(Quaternion.identity()),
            ], 4)
            this.wait();
        }

        this.reset();

    }

}