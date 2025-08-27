import { interpolateColor, Line, Quaternion, Tex, Value, Vector3 } from "../../vector/src";
import { TransformScene } from "./TransformScene";

export class TransformRotateAroundAxisHighlightCubeFace extends TransformScene {

    constructor() {
        super();
        
        let angle = Math.PI/2;
        let sineOfAngle = Math.sin(angle);
        let axis = new Vector3(1, 1, 1).normalize();
        

        // Add text labels for the transformation formulas
        let f1 = this.viewPort.frame.tex('f(p) = q \\cdot p').alignCenter();
        f1.setAttribute('font-size', '18px');
        f1.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50)

        let f2 = this.viewPort.frame.tex('f(p) = q \\cdot p \\cdot q^{-1}').alignCenter();
        f2.setAttribute('font-size', '18px');
        f2.setOpacity(0);
        f2.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50)

        Tex.alignBy(f2, f1, 'f(p) = q \\cdot p');
              
        // let w = new Quaternion(0, 1, 1, 1).normalize().scale(0.43);
        // this.orientQ(w);
        // this.pointQ(w, 'var(--font-color)');

        let r = new Quaternion(
            Math.cos(angle),
            axis.x * sineOfAngle,
            axis.y * sineOfAngle,
            axis.z * sineOfAngle
        );

        let theta = new Value(0);

        this.left.addDependency(theta);
        this.left.update = () => {
            let sineOfTheta = Math.sin(theta.value);
            this.left.w = Math.cos(theta.value);
            this.left.x = axis.x * sineOfTheta;
            this.left.y = axis.y * sineOfTheta;
            this.left.z = axis.z * sineOfTheta;
        }

        let thetaTex = this.viewPort.frame.tex('');
        thetaTex.setAttribute('font-size', '18px');
        thetaTex.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 85)
        thetaTex.addDependency(theta);
        thetaTex.update = () => {
            thetaTex.replace('\\theta = ' + theta.value.toFixed(2));
        }
        thetaTex.update()
        thetaTex.alignCenter();
        Tex.alignHorizontallyBy(thetaTex, f1, '=');

        this.reset = () => {
            this.topFacePath.setAttribute('opacity', '0');
            this.clear();
            this.wait();
            this.play([
                this.topFacePath.animate.setOpacity(1),
            ], 1)
            this.wait();
            this.play([
                theta.animate.setValue(2*Math.PI),
            ], 20, "linear")
        }
        this.reset();

        // this.reset = () => {

        //     this.clear();

        //     this.play([
        //         this.left.animate.rotateBy(r),
        //     ], 5, "linear")

        //     this.play([
        //         this.left.animate.rotateBy(r),
        //     ], 5, "linear")

        //     this.play([
        //         this.left.animate.rotateBy(r),
        //     ], 5, "linear") 
            
        //     this.play([
        //         this.left.animate.rotateBy(r),
        //     ], 5, "linear") 
        // }
        // this.reset();
    }
} 