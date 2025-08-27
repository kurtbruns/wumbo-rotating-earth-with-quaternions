import { Quaternion, Vector3 } from "../vector/src";
import { EarthScene } from "./EarthScene";


export class EarthOrientationTesting extends EarthScene {
    constructor() {

        super({
            // cameraPosition: new Vector3(0, 0, -3),
        });

        this.q.set(new Quaternion(0.48, -0.53, 0.44, 0.55))


    }


}