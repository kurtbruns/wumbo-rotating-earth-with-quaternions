import { Quaternion, Tex, Value, Vector3 } from "../../vector/src";
import { SphereScene } from "../SphereScene";

export class BasisVectorsCoordinates extends SphereScene {

    axisSize: Value;
    xAxisVector: Vector3;
    yAxisVector: Vector3;
    zAxisVector: Vector3;

    constructor() {

        super({
            drawAxes: true,
            cameraPosition: new Vector3(0, 0, -5.5),
            showQuaternionTex: false,
            size: 1.8,
        });

        let i = new Vector3(1, 0, 0);
        let j = new Vector3(0, 1, 0);
        let k = new Vector3(0, 0, 1);

        let ti = this.orientPoint(i, this.q);
        let tj = this.orientPoint(j, this.q);
        let tk = this.orientPoint(k, this.q);

        let si = this.orientPoint(new Vector3(1, 0, 0).scale(1.25), this.q);
        let sj = this.orientPoint(new Vector3(0, 1, 0).scale(1.25), this.q);
        let sk = this.orientPoint(new Vector3(0, 0, 1).scale(1.25), this.q);

    
        let iLabelSphere = this.sphereLabel(si, '\\hat{\\imath}').setColor('\\hat{\\imath}','var(--red)');
        let jLabelSphere = this.sphereLabel(sj, '\\hat{\\jmath}').setColor('\\hat{\\jmath}','var(--green)');
        let kLabelSphere = this.sphereLabel(sk, '\\hat{k}').setColor('\\hat{k}','var(--blue)');

        iLabelSphere.setAttribute('font-size', '20px')
        jLabelSphere.setAttribute('font-size', '20px')
        kLabelSphere.setAttribute('font-size', '20px')


        let xPos1 = 48;
        let verticalSpacing = 108;
        let iLabel = this.viewPort.frame.tex('\\hat{\\imath} = \\left[\\begin{array}{c} \\: 1 \\:\\\\ 0 \\\\ 0 \\end{array}\\right]', xPos1, 32).setColor('\\hat{\\imath}','var(--red)');
        let jLabel = this.viewPort.frame.tex('\\hat{\\jmath} = \\left[\\begin{array}{c} \\: 0 \\:\\\\ 1 \\\\ 0 \\end{array}\\right]', xPos1, 32 + verticalSpacing).setColor('\\hat{\\jmath}','var(--green)');
        let kLabel = this.viewPort.frame.tex('\\hat{k} = \\left[\\begin{array}{c} \\: 0 \\:\\\\ 0 \\\\ 1 \\end{array}\\right]', xPos1, 32 + verticalSpacing * 2).setColor('\\hat{k}','var(--blue)');

        iLabel.setAttribute('font-size', '18px')
        jLabel.setAttribute('font-size', '18px')
        kLabel.setAttribute('font-size', '18px')

        Tex.alignHorizontallyBy(iLabel, jLabel, '=');
        Tex.alignHorizontallyBy(iLabel, kLabel, '=');

        let xPos2 = 780 - 16;
        let iLabelTransformed = this.viewPort.frame.tex('i = \\left[\\begin{array}{c} \\: 1 \\:\\\\ 0 \\\\ 0 \\end{array}\\right]', xPos2, 32).setColor('i','var(--red)');
        let jLabelTransformed = this.viewPort.frame.tex('j = \\left[\\begin{array}{c} \\: 0 \\:\\\\ 1 \\\\ 0 \\end{array}\\right]', xPos2, 32 + verticalSpacing).setColor('j','var(--green)');
        let kLabelTransformed = this.viewPort.frame.tex('k = \\left[\\begin{array}{c} \\: 0 \\:\\\\ 0 \\\\ 1 \\end{array}\\right]', xPos2, 32 + verticalSpacing * 2).setColor('k','var(--blue)');

        iLabelTransformed.setAttribute('font-size', '18px')
        jLabelTransformed.setAttribute('font-size', '18px')
        kLabelTransformed.setAttribute('font-size', '18px')

        Tex.alignHorizontallyBy(iLabelTransformed, jLabelTransformed, '=');
        Tex.alignHorizontallyBy(iLabelTransformed, kLabelTransformed, '=');
        kLabelTransformed.shift(-6,0)

        iLabelTransformed.addDependency(ti);
        jLabelTransformed.addDependency(tj);
        kLabelTransformed.addDependency(tk);

        let functionName = "f";
        iLabelTransformed.update = () => {
            iLabelTransformed.replace(`${functionName}\\left( \\hat{\\imath} \\right) = \\left[\\begin{array}{c} \\: ${ti.x >= 0 ? '\\phantom{-}' : ''}${ti.x.toFixed(2)} \\:\\\\ ${ti.y >= 0 ? '\\phantom{-}' : ''}${ti.y.toFixed(2)} \\\\ ${ti.z >= 0 ? '\\phantom{-}' : ''}${ti.z.toFixed(2)} \\end{array}\\right]`);
            iLabelTransformed.setColor('\\hat{\\imath}','var(--red)');
        }
        iLabelTransformed.update();

        jLabelTransformed.update = () => {
            jLabelTransformed.replace(`${functionName}\\left( \\hat{\\jmath} \\right) = \\left[\\begin{array}{c} \\: ${tj.x >= 0 ? '\\phantom{-}' : ''}${tj.x.toFixed(2)} \\:\\\\ ${tj.y >= 0 ? '\\phantom{-}' : ''}${tj.y.toFixed(2)} \\\\ ${tj.z >= 0 ? '\\phantom{-}' : ''}${tj.z.toFixed(2)} \\end{array}\\right]`);
            jLabelTransformed.setColor('\\hat{\\jmath}','var(--green)');
        }
        jLabelTransformed.update();

        kLabelTransformed.update = () => {
            kLabelTransformed.replace(`${functionName}\\left( \\hat{k} \\right) = \\left[\\begin{array}{c} \\: ${tk.x >= 0 ? '\\phantom{-}' : ''}${tk.x.toFixed(2)} \\:\\\\ ${tk.y >= 0 ? '\\phantom{-}' : ''}${tk.y.toFixed(2)} \\\\ ${tk.z >= 0 ? '\\phantom{-}' : ''}${tk.z.toFixed(2)} \\end{array}\\right]`);
            kLabelTransformed.setColor('\\hat{k}','var(--blue)');
        }
        kLabelTransformed.update();
        
        this.reset = () => {

            this.clear();

            let startingQuaternion = new Quaternion(0.94, 0.17, -0.23, -0.17).normalize();
            this.q.set(startingQuaternion);

            iLabelTransformed.setAttribute('opacity', '0');
            jLabelTransformed.setAttribute('opacity', '0');
            kLabelTransformed.setAttribute('opacity', '0');

            this.wait() 
            
            this.play([
                iLabelTransformed.animate.setOpacity(1),
            ], 1)

            this.wait(3)

            this.play([
                jLabelTransformed.animate.setOpacity(1),
                kLabelTransformed.animate.setOpacity(1),
            ], 2)

            this.wait(3)


        }
        this.reset();


    }
    
    dissappearingVectorLabel(v: Vector3, label: string, s: number = 0.6): Tex {
        let t = this.tex(v.add(v.copy().normalize().scale(s)), label);
        t.addDependency(v);
        t.update = () => {
            let epsilon = 0.55;
            let dot = this.normal.dot(v);
            if (dot < -epsilon) {
                t.setAttribute('opacity', '0');
            } else {
                t.setAttribute('opacity', Math.abs(dot + epsilon).toFixed(2));
            }

            let u = v.add(v.copy().normalize().scale(s));
            let q = this.camera.projectPoint(u);
            let p = this.viewPort.plot.SVGToRelative(q.x, q.y);
            t.moveTo(p);
        };
        return t;
    }
}