import { Quaternion, Vector3 } from '@kurtbruns/vector';
import { SphereScene } from "../SphereScene";

export class EraseXYAxes extends SphereScene {

    constructor() {

        super({
            drawAxes: true,
            size: 1.5,
            cameraPosition: new Vector3(0, 0, -5.5)
        });

        this.labelBasisVectors();

        let q = new Quaternion(0.83, 0.34, -0.44, 0.02).normalize();
        let r = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI/2)

        this.q.set(r.multiply(q))

        let orientation = new Quaternion(0.94, 0.17, -0.23, -0.17).normalize();
        let orientation2 = new Quaternion(0.83, 0.34, -0.44, 0.02).normalize();

        this.reset = () => {
            this.clear();

            this.wait();

            this.play([
                this.xAxis.animate.setOpacity(0),
                this.yAxis.animate.setOpacity(0),
                this.xAxisLabel.animate.setOpacity(0),
                this.yAxisLabel.animate.setOpacity(0),
                // this.basisVectorLabels.animate.setOpacity(0),
            ], 1.5)

            this.wait();
            
            // this.play([
            //     this.q.animate.slerp(Quaternion.identity()),
            //     this.xAxis.animate.setOpacity(0),
            //     this.yAxis.animate.setOpacity(0),
            //     this.xAxisLabel.animate.setOpacity(0),
            //     this.yAxisLabel.animate.setOpacity(0),
            //     // this.basisVectorLabels.animate.setOpacity(0),
            // ], 4)

            // this.wait(3)
 
        }
        this.reset();


    }


}