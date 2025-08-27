import { Quaternion, Vector3 } from "../../vector/src";
import { SphereScene } from "../SphereScene";

export class QuaternionIdentity extends SphereScene {

    constructor() {

        super({
            drawAxes: false,
            size: 1.5,
            cameraPosition: new Vector3(0, 0, -5.5)
        });

        this.labelBasisVectors();

        this.q.set(Quaternion.identity())

        this.wait(3)

    }

}