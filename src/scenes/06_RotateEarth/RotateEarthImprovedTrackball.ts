import { Quaternion, Vector3, Line, Group, Vector2, interpolateColor, Tex, Value } from "../../vector/src";
import { EarthScene } from "../EarthScene";


export class RotateEarthImprovedTrackball extends EarthScene {

    constructor() {
        super({
            cameraPosition: new Vector3(0, 0, -5),
            drawIJK:false,
            showQuaternionTex: false,
            drawTriangleMesh: true
            
        });
    }
}