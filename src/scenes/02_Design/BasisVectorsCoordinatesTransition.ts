import { Quaternion, Tex, Value, Vector3 } from "../../vector/src";
import { SphereScene } from "../SphereScene";

export class BasisVectorsCoordinatesTransition extends SphereScene {

    axisSize: Value;
    xAxisVector: Vector3;
    yAxisVector: Vector3;
    zAxisVector: Vector3;

    constructor() {

        super({
            drawAxes: false,
            cameraPosition: new Vector3(0, 0, -5.5),
            showQuaternionTex: false,
            size: 2,
        });

        this.labelBasisVectors();



  
        this.reset = () => {

            this.clear();

            this.q.set(new Quaternion(0.94, 0.17, -0.23, -0.17).normalize());

            let i = new Vector3(1, 0, 0);
            let j = new Vector3(0, 1, 0);
            let k = new Vector3(0, 0, 1);
    
            let ti = this.q.transform(i);
            let tj = this.q.transform(j);
            let tk = this.q.transform(k);
            
    
            let axis = ti.add(tj).add(tk).normalize();
    
            // Animate rotation around North Pole
            this.play([
                this.q.animate.rotate(axis, Math.PI),
            ], 10, "easeIn");
    

            this.play([
                this.q.animate.rotate(axis, Math.PI),
            ], 10, "easeOut");
    

    


        }
        this.reset();


    }
    
}