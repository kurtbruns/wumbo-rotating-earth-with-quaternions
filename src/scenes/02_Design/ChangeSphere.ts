import { Quaternion, Vector3 } from '@kurtbruns/vector';
import { SphereScene } from "../SphereScene";



export class ChangeSphere extends SphereScene {
    constructor() {
        super({
            cameraPosition: new Vector3(0, 0, -6),
            showQuaternionTex: false,
            drawIJK: false,
            drawBasisVectors: true,
            drawAxes: true,
            drawSphereCircles: false,
            size: 1.8,
        });

        this.reset = () => {

            let q = new Quaternion(0.83, 0.34, -0.44, 0.02).normalize()
            
            this.clear();
            this.q.set(Quaternion.identity())

            this.play([
                this.q.animate.slerp(q)
            ], 3)

            this.play([
                this.q.animate.slerp(Quaternion.identity())
            ], 3)

            this.wait();

        }
        this.reset();
    }


}