import { Quaternion, Vector3 } from '@kurtbruns/vector';
import { SphereScene } from "../SphereScene";

export class RotateAroundDiagonalAxis extends SphereScene {

    constructor() {

        super({
            drawAxes: false,
            cameraPosition: new Vector3(0, 0, -5.5)
        });

        let q = Quaternion.identity();
        let r = Quaternion.fromAxisAngle(new Vector3(1, 1, 1), -2*Math.PI/3)

        this.q.set(q)

        this.reset = () => {
            this.clear();
            this.play([
                this.q.animate.rotateBy(r)
            ], 4)
 
        }
        this.reset();
    }

}