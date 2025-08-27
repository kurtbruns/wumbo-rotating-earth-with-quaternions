import { Line, Quaternion, Vector3 } from '@kurtbruns/vector';
import { SphereScene } from "../SphereScene";

export class AxisOfRotationUnitTest1 extends SphereScene {

    constructor() {
        super();

        // this.q.set(new Quaternion(-0.67, -0.51, 0.13, 0.52).normalize());

        let q0 = Quaternion.identity();
        (window as any).save = () => {
            q0.set(this.q);
        }

        let r = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), Math.PI/2);

        // this.dissappearingTex(new Vector3(1, 0, 0), 'f(\\hat{\\imath})')
        // .setColor('\\hat{\\imath}', 'var(--green)')
        // this.dissappearingTex(new Vector3(0, 1, 0), 'f(\\hat{\\jmath})')
        // .setColor('\\hat{\\jmath}', 'var(--red)')
        // this.dissappearingTex(new Vector3(0, 0, 1), 'f(\\hat{k})')
        // .setColor('\\hat{k}', 'var(--blue)')



        let label = this.viewPort.frame.tex('', 120, 270);
        label.addDependency(this.q);
        label.update = () => {
            let ti = this.q.transform(new Vector3(1, 0, 0));
            let tj = this.q.transform(new Vector3(0, 1, 0));
            let tk = this.q.transform(new Vector3(0, 0, 1));
            label.replace(`
                \\begin{aligned}
                f(\\hat{\\imath}) &= 
                \\left[
                  \\begin{array}{c} 
                    \\: ${ti.x >= 0 ? '\\phantom{-}' : ''}${ti.x.toFixed(2)} \\: \\\\ 
                    \\: ${ti.y >= 0 ? '\\phantom{-}' : ''}${ti.y.toFixed(2)} \\: \\\\ 
                    \\: ${ti.z >= 0 ? '\\phantom{-}' : ''}${ti.z.toFixed(2)} \\: 
                  \\end{array}
                \\right] \\\\[1em]
                f(\\hat{\\jmath}) &= 
                \\left[
                  \\begin{array}{c} 
                    \\: ${tj.x >= 0 ? '\\phantom{-}' : ''}${tj.x.toFixed(2)} \\: \\\\ 
                    \\: ${tj.y >= 0 ? '\\phantom{-}' : ''}${tj.y.toFixed(2)} \\: \\\\ 
                    \\: ${tj.z >= 0 ? '\\phantom{-}' : ''}${tj.z.toFixed(2)} \\: 
                  \\end{array}
                \\right] \\\\[1em]
                f(\\hat{k}) &= 
                \\left[
                  \\begin{array}{c} 
                    \\: ${tk.x >= 0 ? '\\phantom{-}' : ''}${tk.x.toFixed(2)} \\: \\\\ 
                    \\: ${tk.y >= 0 ? '\\phantom{-}' : ''}${tk.y.toFixed(2)} \\: \\\\ 
                    \\: ${tk.z >= 0 ? '\\phantom{-}' : ''}${tk.z.toFixed(2)} \\: 
                  \\end{array}
                \\right]
                \\end{aligned}
            `)
            label.setColor('\\hat{\\imath}', 'var(--green)')
            label.setColor('\\hat{\\jmath}', 'var(--red)')
            label.setColor('\\hat{k}', 'var(--blue)')
            label.alignCenter();
        }
        label.update();
        label.setColor('\\hat{\\imath}', 'var(--green)')
        label.setColor('\\hat{\\jmath}', 'var(--red)')
        label.setColor('\\hat{k}', 'var(--blue)')



        this.reset = () => {

            let q1 = this.q.copy();

            this.clear()

            this.play([
                this.q.animate.rotateBy(r, false)
            ], 3)

            this.wait();

        }

    }

    dissappearingTex(v:Vector3, t:string, s = 1.75) {

        let tex = this.tex(v, t, undefined, false);
        // tex.setBackgroundOpacity(0.5)

        let copy = v.copy();
        v.addDependency(this.q);
        v.update = () => {
            v.set(this.q.transform(copy).scale(s))

            let epsilon = 0.8;
            let dot = this.normal.dot(v);
            if( dot < -epsilon) {
                tex.setAttribute('opacity', '0');
            } else {
                tex.setAttribute('opacity', Math.abs(dot + epsilon).toFixed(2));
            }

        }
        v.update()
        tex.update()


        return tex;


    }

    







}