import { Point, Quaternion, Tex, Vector3 } from '@kurtbruns/vector';
import { MapMouseToPointAndRotate } from "../06_RotateEarth/MapMouseToPointAndRotate";
import { EarthOrientationUtils } from "../EarthOrientationUtils";
import { SECOND_DRAG_MOUSE_START_X, SECOND_DRAG_MOUSE_START_Y, SECOND_DRAG_MOUSE_END_X, SECOND_DRAG_MOUSE_END_Y } from "./mousePositions";

export class CalculateRotationPartTwo extends MapMouseToPointAndRotate {
    constructor() {

        const mouseStartX = SECOND_DRAG_MOUSE_START_X;
        const mouseStartY = SECOND_DRAG_MOUSE_START_Y;
        const mouseEndX = SECOND_DRAG_MOUSE_END_X;
        const mouseEndY = SECOND_DRAG_MOUSE_END_Y;

        super({
            mouseStartX: mouseStartX,
            mouseStartY: mouseStartY,
            mouseEndX: mouseEndX,
            mouseEndY: mouseEndY,
            distance: -5,
            initialQuaternion: new Quaternion(0.7932, -0.3333, 0.4598, 0.2196),
            firstAnimationDuration: 4.5
        });

        this.shadowMouseGroup.setOpacity(0.75);


        let q1Tex = this.viewPort.frame.tex('q_1 = w_1 + x_1 i + y_1 j + z_1 k');
        q1Tex.setAttribute('font-size', '18px');
        q1Tex.alignCenter();
        q1Tex.moveTo(this.viewPort.frame.width * 0.5 + 32, 50);
        q1Tex.setAttribute('opacity', '0');

        let q2Tex = this.viewPort.frame.tex('q_2 = r \\cdot q_1');
        q2Tex.setAttribute('font-size', '18px');
        q2Tex.alignCenter();
        q2Tex.moveTo(this.viewPort.frame.width * 0.5 + 32, 94);
        q2Tex.setAttribute('opacity', '0');

        Tex.alignHorizontallyBy(q1Tex, q2Tex, 'q_1', 'q_2');

        let rotationTex = this.viewPort.frame.tex('r = \\cos \\left( \\frac{\\theta}{2} \\right) + \\sin \\left( \\frac{\\theta}{2} \\right) \\left( x i + y j + z k \\right)');
        rotationTex.setAttribute('font-size', '18px');
        rotationTex.alignCenter();
        rotationTex.moveTo(this.viewPort.frame.width * 0.5 + 32, this.viewPort.frame.height - 80);
        rotationTex.setColorAll('\\theta', '#72D6BF');
        rotationTex.setColorAll('\\left( x i + y j + z k \\right)', 'var(--pink)');
        rotationTex.setAttribute('opacity', '0');


        let buffer = 48;
        let p1Tex = this.viewPort.frame.tex('p_1 = w_1 + x_1 i + y_1 j + z_1 k = \\left(w_1, \\vec{\\mathbf{v}}_1\\right)');
        p1Tex.setColorAll('x_1', 'var(--yellow)');
        p1Tex.setColorAll('y_1', 'var(--yellow)');
        p1Tex.setColorAll('z_1', 'var(--yellow)');
        p1Tex.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)');
        p1Tex.setAttribute('font-size', '18px');
        // p1Tex.alignCenter();
        p1Tex.moveTo(32, this.viewPort.frame.height - 3*buffer - 10);

        let p2Tex = this.viewPort.frame.tex('p_2 = w_2 + x_2 i + y_2 j + z_2 k = \\left(w_2, \\vec{\\mathbf{v}}_2\\right)');
        p2Tex.setColorAll('x_2', 'var(--cyan)');
        p2Tex.setColorAll('y_2', 'var(--cyan)');
        p2Tex.setColorAll('z_2', 'var(--cyan)');
        p2Tex.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)');
        p2Tex.setAttribute('font-size', '18px');
        // p2Tex.alignCenter();
        p2Tex.moveTo(32, this.viewPort.frame.height - 2*buffer - 10);
        // p2Tex.setAttribute('opacity', '0');

        let productTex = this.viewPort.frame.tex('p_1 \\cdot p_2=\\left(w_1 w_2-\\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2, w_1 \\vec{\\mathbf{v}}_2+w_2 \\vec{\\mathbf{v}}_1+\\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2\\right) = \\left( - \\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2, \\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2\\right)');
        productTex.setAttribute('font-size', '18px');
        productTex.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)');
        productTex.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)');
        productTex.moveTo(32, this.viewPort.frame.height - 1*buffer - 10);
        // productTex.setAttribute('opacity', '0');

        let v1 = new Vector3();
        v1.addDependency(this.p1);
        v1.update = () => {
            v1.set(this.p1.toVector3());
        }
        v1.update();

        let v2 = new Vector3();
        v2.addDependency(this.p2);
        v2.update = () => {
            v2.set(this.p2.toVector3());
        }
        v2.update();


        let v1Label = this.vectorLabel(v1, '\\vec{\\mathbf{v}}_1 = \\left[ \\begin{array}{c} \\: x_1 \\:  \\\\ y_1 \\\\ z_1 \\end{array} \\right]', 1.25);
        v1Label.setAttribute('font-size', '18px');
        v1Label.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)');
        v1Label.setColorAll('\\left[ \\begin{array}{c} \\: x_1 \\:  \\\\ y_1 \\\\ z_1 \\end{array} \\right]', 'var(--yellow)');
        let v2Label = this.vectorLabel(v2, '\\vec{\\mathbf{v}}_2 = \\left[ \\begin{array}{c} \\: x_2 \\: \\\\ y_2 \\\\ z_2 \\end{array} \\right]', 1.25);
        v2Label.setAttribute('font-size', '18px');
        v2Label.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)');
        v2Label.setColorAll('\\left[ \\begin{array}{c} \\: x_2 \\: \\\\ y_2 \\\\ z_2 \\end{array} \\right]', 'var(--cyan)');
        v2Label.shift(0, -8)

        v1Label.setOpacity(0);
        v2Label.setOpacity(0);

        this.t.set(1);

        this.reset = () => {

            v2Label.shift(0,-18)

            p1Tex.setAttribute('opacity', '0');
            p2Tex.setAttribute('opacity', '0');
            productTex.setAttribute('opacity', '0');

            Tex.setOpacity(p1Tex.getFirstMatch('= \\left(w_1, \\vec{\\mathbf{v}}_1\\right)'), 0);
            Tex.setOpacity(p2Tex.getFirstMatch('= \\left(w_2, \\vec{\\mathbf{v}}_2\\right)'), 0);
            Tex.setOpacity(productTex.getFirstMatch('= \\left( - \\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2, \\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2\\right)'), 0);
            


            this.clear();

            this.wait();

            this.play([
                p1Tex.animate.setOpacity(1),
                p2Tex.animate.setOpacity(1),
            ], 1);

            this.wait(12);

            this.play([
                v1Label.animate.setOpacity(1),
                v2Label.animate.setOpacity(1),
                p1Tex.animate.setOpacityOfParts('= \\left(w_1, \\vec{\\mathbf{v}}_1\\right)', 1),
                p2Tex.animate.setOpacityOfParts('= \\left(w_2, \\vec{\\mathbf{v}}_2\\right)', 1),
            ], 1);

            this.wait(9);

            this.play([
                productTex.animate.setOpacity(1),
            ], 1);

            this.wait(7.5);
            
            this.play([
                productTex.animate.setOpacityOfParts('= \\left( - \\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2, \\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2\\right)', 1),
            ], 1);
            
            this.wait(2);
                

        }
        this.reset();

    }
}
