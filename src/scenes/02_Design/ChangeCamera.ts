
import { Quaternion, Vector3 } from "../../vector/src";
import { SphereSceneDuplicate } from "./SphereSceneDuplicate";


export class ChangeCamera extends SphereSceneDuplicate {
    constructor() {

        let s = 1.8;
        super({
            cameraPosition: new Vector3(0, 0, -6),
            showQuaternionTex: false,
            drawIJK: false,
            drawBasisVectors: true,
            drawAxes: true,
            drawSphereCircles: false,
            size: s,
        });
 
        // this.drawAxes(s) 
        // this.background.appendChild(this.zAxis);
        // console.log(this.zAxis)

        // let zPos = this.drawVectorOnSphere(new Vector3(0, 0, 1), 1, 2.75, 'var(--medium)' )
        // let zPos = this.drawVectorOnSphere(new Vector3(0, 0, 1), 1.5, 2.75/1.5, 'var(--medium)' )
        // this.foreground.prependChild(zPos);

        let zp = this.vector(this.origin, new Vector3(0, 0, s), 'var(--font-color-light)');
        let zn = this.vector(this.origin, new Vector3(0, 0, -s), 'var(--font-color-light)');
        this.foreground.prependChild(zp);
        this.foreground.prependChild(zn);
        
        // this.foreground.appendChild(this.zAxis);
        this.foreground.appendChild(this.basisVectors);
        this.foreground.appendChild(this.zAxisLabel);

        this.xAxisLabel.root.remove()
        this.yAxisLabel.root.remove()
        this.zAxisLabel.root.remove()
        this.labelAxes(s, {a:0.25})
        this.foreground.prependChild(this.zAxisLabel)

        this.upAxis = 'y';

        this.reset = () => {
            this.clear();

            let q = new Quaternion(0.83, 0.34, -0.44, 0.02).normalize().inverse()
            // let u = new Quaternion(0.83659, -0.29124, -0.43820, 0.15255).normalize();
            // let r = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI/8)
            // let r = Qu
            // let q = u.multiply(r)

            this.wait(); 
            this.play([
                this.camera.animate.slerp(q),
            ], 3)

            this.play([
                this.camera.animate.change(Quaternion.identity(),6)
            ], 3)

            this.play([
                this.zAxisLabel.animate.setOpacity(0)
            ], 1)

            this.wait(1);
        }
        this.reset();
    }


}