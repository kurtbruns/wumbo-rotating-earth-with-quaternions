import { Quaternion, Vector3, Line, Group, Vector2, interpolateColor, Tex, Value } from '@kurtbruns/vector';
import { EarthScene } from "../EarthScene";


export class ClickAndDrag extends EarthScene {


    constructor() {
        super({
            cameraPosition: new Vector3(0, 0, -5),
            drawIJK:false,
            showQuaternionTex: false,
            drawTriangleMesh: true
            
        });
        
        
        this.onLoad = () => {
            // this.q.set(new Quaternion(0.7932, 0.3333, -0.4598, -0.2196))
            this.q.set(new Quaternion(0.7932, -0.3333, 0.4598, 0.2196))
        }

    }

}