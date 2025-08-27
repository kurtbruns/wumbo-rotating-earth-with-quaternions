import { Quaternion, Vector3 } from "../../vector/src";
import { SphereScene } from "../SphereScene";


export class BasisVectorsIntro extends SphereScene {
    constructor() {
        super({
            cameraPosition: new Vector3(0, 0, -5.5),
            showQuaternionTex: false,
            drawIJK: false,
            drawBasisVectors: true,
            drawAxes: true,
            drawSphereCircles: false,
            size: 1.8,
        });

        this.reset = () => {

            let q = new Quaternion(0.94, 0.17, -0.23, -0.17).normalize()
            
            this.clear();
            this.q.set(Quaternion.identity())

            this.play([
                this.q.animate.slerp(q)
            ], 3)

            this.wait();

        }
        this.reset();
    }


}