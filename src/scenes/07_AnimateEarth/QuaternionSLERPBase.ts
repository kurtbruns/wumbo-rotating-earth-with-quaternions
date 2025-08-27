import { Quaternion, Value, Vector3 } from '@kurtbruns/vector';
import { SphereOrientationSideBySide } from "../SphereOrientationSideBySide";
import { LEFT_Q_VALUE, RIGHT_Q_VALUE } from "./QuaternionValues";

export class QuaternionSLERPBase extends SphereOrientationSideBySide {
    protected shortestPath: boolean;

    constructor(shortestPath: boolean = false) {
        // let initialQ = new Quaternion(-0.1855, 0.3381, 0.3258, 0.8632).normalize();

        let leftQ = LEFT_Q_VALUE;
        // let rightQ = new Quaternion(-0.6671, -0.1022, 0.7013, 0.2294).normalize();
        let rightQ = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), -Math.PI/6).multiply(LEFT_Q_VALUE);

        super({
            leftQ: leftQ.copy(),
            rightQ: shortestPath ? rightQ.copy() : rightQ.negate(),
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

        let tStartValueTex = this.frame.tex(`t = 0`);
        tStartValueTex.setAttribute('font-size', '18px');
        tStartValueTex.moveTo(this.frame.width / 2 - xShift, 3*spacing);
        tStartValueTex.alignCenter();
        tStartValueTex.setAttribute('opacity', '0')

        let tEndValueTex = this.frame.tex(`t = 1`);
        tEndValueTex.setAttribute('font-size', '18px');
        tEndValueTex.moveTo(this.frame.width / 2 - xShift, 3*spacing);
        tEndValueTex.alignCenter();
        tEndValueTex.setAttribute('opacity', '0')

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

        tStartValueTex.alignTo(tValueTex, '=')
        tEndValueTex.alignTo(tValueTex, '=')

        this.drawPathArrow();
        this.pathArrow.setAttribute('opacity', '1')


        let q_2_double_cover = this.rightSphere.q.negate();
        q_2_double_cover.addDependency(this.rightSphere.q)
        q_2_double_cover.update = () => {
            q_2_double_cover.set(this.rightSphere.q.negate());
        }
        q_2_double_cover.update();

        let dot1 = new Value();
        dot1.addDependency(this.leftSphere.q, this.rightSphere.q)
        dot1.update = () => {
            dot1.set(this.leftSphere.q.w*this.rightSphere.q.w + this.leftSphere.q.x*this.rightSphere.q.x + this.leftSphere.q.y*this.rightSphere.q.y + this.leftSphere.q.z*this.rightSphere.q.z);
        }
        dot1.update();

        let dot2 = new Value();
        dot2.addDependency(this.leftSphere.q, q_2_double_cover)
        dot2.update = () => {
            dot2.set(this.leftSphere.q.w*q_2_double_cover.w + this.leftSphere.q.x*q_2_double_cover.x + this.leftSphere.q.y*q_2_double_cover.y + this.leftSphere.q.z*q_2_double_cover.z);
        }
        dot2.update();

        let dot1Tex = this.frame.tex(`d_1 = ${dot1.value.toFixed(2)}`);
        dot1Tex.setAttribute('font-size', '18px');
        dot1Tex.moveTo(this.frame.width / 2, this.frame.height - 100);
        dot1Tex.alignCenter();
        dot1Tex.addDependency(dot1)
        dot1Tex.update = () => {
            dot1Tex.replace(`d_1 = ${dot1.value.toFixed(2)}`);
        }
        dot1Tex.update();
        dot1Tex.setAttribute('opacity', '0')

        let dot2Tex = this.frame.tex(`d_2 = ${dot2.value.toFixed(2)}`);
        dot2Tex.setAttribute('font-size', '18px');
        dot2Tex.moveTo(this.frame.width / 2, this.frame.height - 50);
        dot2Tex.alignCenter();
        dot2Tex.addDependency(dot2)
        dot2Tex.update = () => {
            dot2Tex.replace(`d_2 = ${dot2.value.toFixed(2)}`);
        }
        dot2Tex.update();
        dot2Tex.setAttribute('opacity', '0')

        this.reset = () => {
            q_copy.set(this.leftSphere.q.copy());
            r.set(this.rightSphere.q.multiply(this.leftSphere.q.conjugate()));

            tStartValueTex.moveTo(this.frame.width * 0.25 , this.frame.height - 75)
            tEndValueTex.moveTo(this.frame.width * 0.75 , this.frame.height - 75)
            this.clear()

            this.wait()

            this.play([
                t.animate.setValue(1),
            ], shortestPath ? 4 : 5)

            this.wait()
        }

        this.reset();
    }
} 