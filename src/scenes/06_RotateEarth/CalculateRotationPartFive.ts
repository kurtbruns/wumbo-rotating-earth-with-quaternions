import { Point, Quaternion, Tex, Vector3 } from "../../vector/src";
import { MapMouseToPointAndRotate } from "../06_RotateEarth/MapMouseToPointAndRotate";
import { SECOND_DRAG_MOUSE_START_X, SECOND_DRAG_MOUSE_START_Y, SECOND_DRAG_MOUSE_END_X, SECOND_DRAG_MOUSE_END_Y } from "./mousePositions";

export class CalculateRotationPartFive extends MapMouseToPointAndRotate {
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

        let productTex = this.viewPort.frame.tex('p_1 \\cdot p_2=\\left(w_1 w_2-\\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2, w_1 \\vec{\\mathbf{v}}_2+w_2 \\vec{\\mathbf{v}}_1+\\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2\\right) = \\left( - \\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2, \\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2\\right)', 0, 0, false);
        productTex.setAttribute('font-size', '18px');
        productTex.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)');
        productTex.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)');
        productTex.moveTo(32, this.viewPort.frame.height - 1*buffer - 10);
        // productTex.setAttribute('opacity', '0');
        productTex.setOpacityOfParts('p_1 \\cdot p_2= ', 0);
        productTex.setOpacity(0)


        let productTex2 = this.viewPort.frame.tex('p_1 \\cdot p_2= \\left( - \\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2, \\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2\\right) = -\\cos(\\theta) + \\sin(\\theta) \\left( x i + y j + z k \\right)', 0, 0, false);
        productTex2.setAttribute('font-size', '18px');
        productTex2.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)');
        productTex2.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)');
        productTex2.setColorAll('\\left( x i + y j + z k \\right)', 'var(--pink)');
        productTex2.moveTo(32, this.viewPort.frame.height - 1*buffer - 10);

        productTex2.setOpacityOfParts('\\left( - \\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2, \\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2\\right)', 0);
        productTex2.setOpacityOfParts('= -\\cos(\\theta) + \\sin(\\theta) \\left( x i + y j + z k \\right)', 0);
        productTex2.setOpacity(0)

        let productTex3 = this.viewPort.frame.tex('p_2 \\cdot \\overline{p_1}=(w_1 w_2+\\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2, \\: w_1 \\vec{\\mathbf{v}}_2-w_2 \\vec{\\mathbf{v}}_1+\\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2 )', 0, 0, false);
        productTex3.setAttribute('font-size', '18px');
        productTex3.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)');
        productTex3.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)');
        productTex3.setColorAll('\\left( x i + y j + z k \\right)', 'var(--pink)');
        productTex3.moveTo(32, this.viewPort.frame.height - 1*buffer - 10);
        productTex3.setOpacity(0)


        let productPart1 = this.viewPort.frame.tex('\\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2,', 0, 0, false);
        productPart1.setAttribute('font-size', '18px');
        productPart1.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)');
        productPart1.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)');
        Tex.alignBy(productTex3, productPart1, '\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2');
        productPart1.setOpacity(0)

        let productPart2 = this.viewPort.frame.tex('\\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2)', 0, 0, false);
        productPart2.setAttribute('font-size', '18px');
        productPart2.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)');
        productPart2.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)');
        Tex.alignBy(productTex3, productPart2, '\\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2');
        productPart2.setOpacity(0)

        let productTex4 = this.viewPort.frame.tex('p_2 \\cdot \\overline{p_1}=(\\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2, \\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2 ) =', 0, 0, false);
        productTex4.setAttribute('font-size', '18px');
        productTex4.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)');
        productTex4.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)');
        productTex4.setColorAll('\\left( x i + y j + z k \\right)', 'var(--pink)');
        productTex4.moveTo(32, this.viewPort.frame.height - 1*buffer - 10);
        // productTex4.setOpacityOfParts('(\\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2, \\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2 )', 0)
        productTex4.setOpacity(0)

        let productTex5 = this.viewPort.frame.tex('p_2 \\cdot \\overline{p_1}= ( \\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2, \\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2 ) = \\cos(\\theta) + \\sin(\\theta) \\left( x i + y j + z k \\right)', 0, 0, false);
        productTex5.setAttribute('font-size', '18px');
        productTex5.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)');
        productTex5.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)');
        productTex5.setColorAll('\\left( x i + y j + z k \\right)', 'var(--pink)');
        productTex5.moveTo(32, this.viewPort.frame.height - 1*buffer - 10);
        productTex5.setOpacity(0)

        let productTex5a = this.viewPort.frame.tex('p_2 \\cdot \\overline{p_1}= \\cos(\\theta) + \\sin(\\theta) \\left( x i + y j + z k \\right)', 0, 0, false);
        productTex5a.setAttribute('font-size', '18px');
        productTex5a.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)');
        productTex5a.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)');
        productTex5a.setColorAll('\\left( x i + y j + z k \\right)', 'var(--pink)');
        productTex5a.moveTo(32, this.viewPort.frame.height - 1*buffer - 10);
        productTex5a.setOpacityOfParts('p_2 \\cdot \\overline{p_1}= \\cos(\\theta) + \\sin(\\theta) \\left( x i + y j + z k \\right)', 0)
        Tex.alignBy(productTex5, productTex5a, 'p_2 \\cdot \\overline{p_1}=')

        let productTex6 = this.viewPort.frame.tex('\\left( \\, p_2 \\cdot \\overline{p_1} \\, \\right)^{\\frac{1}{2}}=\\cos \\left( \\frac{\\theta}{2} \\right) + \\sin \\left( \\frac{\\theta}{2} \\right) \\left( x i + y j + z k \\right)', 0, 0, false);
        productTex6.setAttribute('font-size', '18px');
        productTex6.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)');
        productTex6.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)');
        productTex6.setColorAll('\\left( x i + y j + z k \\right)', 'var(--pink)');
        productTex6.moveTo(32, this.viewPort.frame.height - 1*buffer - 15);
        productTex6.setOpacity(0)
        Tex.alignBy(productTex5a, productTex6, 'p_2 \\cdot \\overline{p_1}=')

        

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



        let dotProductFormula = this.viewPort.frame.tex('\\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2=\\left\\|\\vec{\\mathbf{v}}_1\\right\\| \\left\\|\\vec{\\mathbf{v}}_2\\right\\| \\cos (\\theta)');
        dotProductFormula.alignCenter();
        dotProductFormula.moveTo(this.viewPort.frame.width * 0.75 + 32, 75);
        dotProductFormula.setAttribute('font-size', '18px');
        dotProductFormula.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)');
        dotProductFormula.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)');
        dotProductFormula.setColorAll('\\cos (\theta)', 'var(--pink)');
        

        let magnitudeOfCrossProductFormula = this.viewPort.frame.tex('\\left\\|\\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2\\right\\| = \\left\\|\\vec{\\mathbf{v}}_1\\right\\| \\left\\|\\vec{\\mathbf{v}}_2\\right\\| \\sin (\\theta)');
        magnitudeOfCrossProductFormula.alignCenter();
        magnitudeOfCrossProductFormula.setAttribute('font-size', '18px');
        magnitudeOfCrossProductFormula.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)');
        magnitudeOfCrossProductFormula.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)');
        magnitudeOfCrossProductFormula.moveTo(this.viewPort.frame.width * 0.75 + 32, 123);
        

        Tex.alignHorizontallyBy(dotProductFormula, magnitudeOfCrossProductFormula, '=');

        this.t.set(1);

        this.reset = () => {

            v2Label.shift(0,-18)

            this.clear();

            this.wait()

            this.play([
                productTex3.animate.setOpacity(1),
            ], 1);

            this.wait(2)

            this.play([
                productTex3.animate.setOpacityOfParts('w_1 w_2+\\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2, \\: w_1 \\vec{\\mathbf{v}}_2-w_2 \\vec{\\mathbf{v}}_1+\\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2)', 0),
                productPart1.animate.setOpacity(1),
                productPart2.animate.setOpacity(1),
            ], 1);

            this.play([
                productPart1.animate.alignParts(productTex4, '\\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2'),
                productPart2.animate.alignParts(productTex4, '\\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2'),
            ], 1);

            this.play([
                productPart1.animate.setOpacity(0),
                productPart2.animate.setOpacity(0),
                productTex4.animate.setOpacity(0),
                productTex3.animate.setOpacity(0),
                productTex5.animate.setOpacity(1),
                productTex5a.animate.setOpacityOfParts('p_2 \\cdot \\overline{p_1}=', 1)

            ], 1);

            this.wait(7.5)

            // this.play([
            //     productTex5.animate.setOpacityOfParts('p_2 \\cdot \\overline{p_1}= \\left( \\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2 , \\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2 \\right) =', 0),
            // ], 1);

            // this.play([
            //     productTex5.animate.alignParts(productTex5a, '\\cos'),
            // ])

            this.play([
                productTex5.animate.setOpacity(0),

            ])

            this.play([
                productTex5a.animate.setOpacity(0),
                productTex6.animate.setOpacity(1),
            ])
            
            this.wait()
            
            
            
   

        }
        this.reset();

    }
}
