import { Quaternion, Value, Vector3 } from '@kurtbruns/vector';
import { EarthScene } from "./EarthScene";


export class EarthRotateByArbitraryAngle extends EarthScene {

    constructor() {

        super({

        });

        let initial = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), -Math.PI/2);
        initial = initial.multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), -Math.PI/2));

        this.q.set(initial);

        this.reset = () => {

            let axis = this.q.transform(new Vector3(0, 0, 1));

            this.clear();
            this.play([
                this.q.animate.rotate(axis, Math.PI)
            ], 4)


        }
        

    }


}