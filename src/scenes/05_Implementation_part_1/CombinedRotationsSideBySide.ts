import { Group, Quaternion, Vector3 } from '@kurtbruns/vector';
import { SphereOrientationSideBySide } from "../SphereOrientationSideBySide";

export class CombinedRotationsSideBySide extends SphereOrientationSideBySide {

    leftBasisLabels: Group;
    rightBasisLabels: Group;

    constructor() {
        super({
            leftQ: Quaternion.identity(),
            rightQ: Quaternion.identity(),
            drawRotationAxes: false,
        });

        let q = Quaternion.identity();
        let r1 = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), Math.PI/2);
        let r2 = Quaternion.fromAxisAngle(new Vector3(1, 1, 1), -2*Math.PI/3);

        // let r1Tex = this.frame.tex('a = \\cos\\left(\\frac{\\pi}{4}\\right) + \\sin\\left(\\frac{\\pi}{4}\\right)\\left(1i + 0j + 0k\\right)');
        // r1Tex.alignCenter()
        // // r1Tex.setAttribute('font-size', '18px');
        // r1Tex.moveTo(this.frame.width / 2, this.frame.height - 120);
        // let r2Tex = this.frame.tex('b = \\cos\\left(-\\frac{2\\pi}{3}\\right) + \\sin\\left(-\\frac{2\\pi}{3}\\right)\\left(1i + 1j + 1k\\right)');
        // r2Tex.alignCenter()
        // // r2Tex.setAttribute('font-size', '18px');
        // r2Tex.moveTo(this.frame.width / 2, this.frame.height - 60);

        let orderMaters = this.frame.tex('a \\cdot b \\neq b \\cdot a');
        orderMaters.setAttribute('font-size', '24');
        orderMaters.alignCenter()
        orderMaters.moveTo(this.frame.width / 2, this.frame.height - 100);
        orderMaters.setAttribute('opacity', '0')
        orderMaters.drawBackground(true);


        this.leftBasisLabels = this.leftSphere.labelBasisVectors();
        this.rightBasisLabels = this.rightSphere.labelBasisVectors();
        this.reset = () => {

            this.clear();

            this.leftSphere.q.set(r2.multiply(r1));

            this.wait()
            this.play([
                this.rightSphere.q.animate.rotateBy(r2),
            ], 4);
            this.wait(1);
            this.play([
                this.rightSphere.q.animate.rotateBy(r1),
            ], 4);
            this.wait(8);

            this.play([
                orderMaters.animate.setOpacity(1),
            ], 2);
            this.wait(2);

            this.play([
                this.rightSphere.root.animate.setOpacity(0),
                orderMaters.animate.setOpacity(0),
                this.leftSphere.q.animate.slerp(Quaternion.identity()),
                this.rightSphere.displayTex.animate.setOpacity(0),
            ], 3);
            this.wait(1);



        };
        this.reset();
    }
    

    
}
