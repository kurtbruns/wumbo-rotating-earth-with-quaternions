import { Quaternion, Value, Vector3 } from "../../vector/src";
import { SphereOrientationSideBySide } from "../SphereOrientationSideBySide";
import { LEFT_Q_VALUE, RIGHT_Q_VALUE } from "./QuaternionValues";

export class QuaternionSLERPDoubleCoverTransitionIn extends SphereOrientationSideBySide {
    protected shortestPath: boolean;

    constructor(shortestPath: boolean = false) {
        // let initialQ = new Quaternion(-0.1855, 0.3381, 0.3258, 0.8632).normalize();

        let leftQ = LEFT_Q_VALUE;
        let rightQ = RIGHT_Q_VALUE;

        super({
            leftQ: leftQ.copy(),
            rightQ: rightQ.copy(),
            drawRotationAxes: true,
            drawRightRotationAxes: true,
        });

        this.shortestPath = shortestPath;

        let xShift = 0
        let spacing = 50

        let t = new Value(0);

        let q_copy = this.leftSphere.q.copy();
        let r = new Quaternion(1, 0, 0, 0);
        this.leftSphere.q.addDependency(r, t, q_copy)
        this.leftSphere.q.update = () => {
            this.leftSphere.q.set(r.pow(t.value).multiply(q_copy));
        }
        this.leftSphere.q.update();

        let slerpTex = this.frame.tex(`q = \\left( q_2 \\cdot q_1^{-1} \\right)^t \\cdot q_1`);
        slerpTex.setAttribute('font-size', '18px');
        slerpTex.moveTo(this.frame.width / 2 - xShift, 150);
        slerpTex.drawBackground(true, 'var(--background)', 4)
        slerpTex.alignCenter();        

        let tValueTex = this.frame.tex(`t = 0`);
        tValueTex.setAttribute('font-size', '18px');
        tValueTex.moveTo(this.frame.width / 2, this.frame.height / 2);
        tValueTex.alignCenter();
        tValueTex.addDependency(t)
        tValueTex.update = () => {
            tValueTex.replace(`t = ${t.value.toFixed(2)}`);
            tValueTex.drawBackground(true, 'var(--background)', 4)
        }
        tValueTex.update();
        tValueTex.setAttribute('opacity', '0')

        this.drawPathArrow();
        this.pathArrow.setAttribute('opacity', '1')


        let q_2_double_cover = this.rightSphere.q.negate();
        q_2_double_cover.addDependency(this.rightSphere.q)
        q_2_double_cover.update = () => {
            q_2_double_cover.set(this.rightSphere.q.negate());
        }
        q_2_double_cover.update();

        let axis = new Vector3(0, 1, 0);
        let w = new Value();
        let fullRotation = new Quaternion(1, 0, 0, 0);
        fullRotation.addDependency(w)
        fullRotation.update = () => {
            fullRotation.set(Quaternion.fromAxisAngle(axis, 2*Math.PI*w.value));
        }
        fullRotation.update();

        let right_q_copy = this.rightSphere.q.copy();
        this.rightSphere.q.addDependency(fullRotation, right_q_copy)
        this.rightSphere.q.update = () => {
            this.rightSphere.q.set(fullRotation.multiply(right_q_copy));
        }
        this.rightSphere.q.update();

        w.set(0.5)
        w.set(0)

        this.reset = () => {

            this.positiveAxis.setAttribute('opacity', '0')
            this.negativeAxis.setAttribute('opacity', '0')
            this.positiveAxisRight.setOpacity(0)
            this.negativeAxisRight.setOpacity(0)
            this.rotationTex.setAttribute('opacity', '1')

            this.clear()


            this.wait();
            
            this.play([
                this.rightSphere.q.animate.slerp(this.leftSphere.q),
            ], 4)

            this.wait(1);
        }

        this.reset();
    }
} 