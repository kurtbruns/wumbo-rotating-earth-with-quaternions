import { Group, interpolateColor, Quaternion, Vector2, Vector3 } from "../../vector/src";
import { SphereScene } from "../SphereScene";

export class CombinedRotations extends SphereScene {

    constructor() {
        super({
            drawAxes: false,
            cameraPosition: new Vector3(0, 0, -5.5)
        });

        this.clear();
        this.labelBasisVectors();

        let q = Quaternion.identity();
        let r1 = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), Math.PI/2);
        let r2 = Quaternion.fromAxisAngle(new Vector3(1, 1, 1), -2*Math.PI/3);


        let axisCone = this.drawStaticConeArrowOutOfSphere(new Vector3(1, 1, 1), 1, 1.5, 'var(--pink)');
        axisCone.setAttribute('opacity', '0');

        this.q.set(r1);

        this.reset = () => {
            this.clear();
            // this.play([
            //     this.q.animate.rotateBy(r1),
            // ], 4);
            this.wait();
            this.play([
                axisCone.animate.setOpacity(1),
            ], 1);
            this.wait(); 
            this.play([
                this.q.animate.rotateBy(r2),
            ], 4);
            this.play([
                axisCone.animate.setOpacity(0),
            ], 1);
            this.wait();
        }
        this.reset();
    }



} 