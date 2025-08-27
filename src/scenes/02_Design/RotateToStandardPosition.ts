import { Quaternion, Tex, Value, Vector3 } from "../../vector/src";
import { SphereScene } from "../SphereScene";

export class RotateToStandardPosition extends SphereScene {

    constructor() {

        super({
            drawAxes: true,
            cameraPosition: new Vector3(0, 0, -5.5),
            showQuaternionTex: false,
            size: 1.8,
        });

        
        this.reset = () => {
            this.q.set(new Quaternion(0.94, 0.17, -0.23, -0.17).normalize());
            this.play([
                this.q.animate.slerp(Quaternion.identity()),
            ], 3)
        }
        this.reset();


    }
    
}