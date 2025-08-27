import { Quaternion, Vector3 } from '@kurtbruns/vector';
import { SphereScene } from "../SphereScene";

export class CombinedRotationsSideBySideTransition extends SphereScene {

    constructor() {
        super({
            drawAxes: false,
            cameraPosition: new Vector3(0, 0, -5.5)
        });

        this.labelBasisVectors();

        let q = Quaternion.identity();
        let r1 = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), Math.PI/2);
        let r2 = Quaternion.fromAxisAngle(new Vector3(1, 1, 1), -2*Math.PI/3);

        this.q.set(r2.multiply(r1));

        this.reset = () => {
            this.clear();
            this.wait()
            this.play([
                this.q.animate.slerp(Quaternion.identity()),
            ], 3);
            this.wait()
        }
        this.reset();
    }
} 