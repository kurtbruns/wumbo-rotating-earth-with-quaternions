import { CoordinateSystem, Quaternion, ScenePlayer, Tex, Vector3 } from "../../vector/src";

export class QuaternionMultiplication extends ScenePlayer {

    constructor() {
        super({
            width: 960,
            height: 540,
        });

        // Basic component form
        let texStr1 = `\\begin{aligned}& q_1=w_1+x_1 i+y_1 j+z_1 k \\\\[0.25em] & q_2=w_2+x_2 i+y_2 j+z_2 k\\end{aligned}`  

        // Scalar-vector form
        let texStr1b = `\\begin{aligned}& q_1=w_1+x_1 i+y_1 j+z_1 k =\\left(w_1, \\vec{\\mathbf{v}}_1\\right) \\\\ & q_2=w_2+x_2 i+y_2 j+z_2 k =\\left(w_2, \\vec{\\mathbf{v}}_2\\right)\\end{aligned}`

        let texStr2 = `q_1 \\cdot q_2 = \\ldots`

        // Full component form result
        let texStr3 = `\\begin{aligned}q_1 \\cdot q_2 =\\ & (w_1 w_2 - x_1 x_2 - y_1 y_2 - z_1 z_2)+ \\\\[0.2em]& (w_1 x_2 + x_1 w_2 + y_1 z_2 - z_1 y_2)\\, i +\\\\[0.2em]& (w_1 y_2 - x_1 z_2 + y_1 w_2 + z_1 x_2)\\, j +\\\\[0.2em]& (w_1 z_2 + x_1 y_2 - y_1 x_2 + z_1 w_2)\\, k \\end{aligned}`

        // Scalar-vector form result
        let texStr4 = `q_1 \\cdot q_2=\\left(w_1 w_2-\\vec{\\mathbf{v}}_1 \\cdot \\vec{\\mathbf{v}}_2, w_1 \\vec{\\mathbf{v}}_2+w_2 \\vec{\\mathbf{v}}_1+\\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2\\right)`

        let shift = 0;
        let tex1 = this.frame.tex(texStr1).moveTo(2*this.frame.width / 3 + shift, 1*this.frame.height / 4 );
        let tex1b = this.frame.tex(texStr1b).moveTo(2*this.frame.width / 3 + shift, 1*this.frame.height / 4 );
        let tex2 = this.frame.tex(texStr2).moveTo(2*this.frame.width / 3 + shift, 2*this.frame.height / 4 );
        let tex3 = this.frame.tex(texStr3).moveTo(2*this.frame.width / 3 + shift, 2*this.frame.height / 4 );
        let tex4 = this.frame.tex(texStr4).moveTo(2*this.frame.width / 3 + shift, 3*this.frame.height / 4 );

        tex3.removeBackground();
        
        // Set font sizes
        tex1.setAttribute('font-size', '20px');
        tex1b.setAttribute('font-size', '20px');
        tex2.setAttribute('font-size', '20px');
        tex3.setAttribute('font-size', '20px');
        tex4.setAttribute('font-size', '20px');

        // Center align all text
        tex1.alignCenter();
        tex1b.alignCenter();
        tex2.alignCenter();
        tex3.alignCenter();
        tex4.alignCenter();

        // Align horizontally by equals signs
        Tex.alignHorizontallyBy(tex1b, tex1, '=');
        // Tex.alignHorizontallyBy(tex1, tex4, '=');
        Tex.alignHorizontallyBy(tex1b, tex3, '=');
        Tex.alignHorizontallyBy(tex1b, tex4, '=');
        Tex.alignBy(tex3, tex2, '=');

        // Set initial opacities - keep original flow intact
        tex1.setOpacity(0);
        tex1b.setOpacity(0);
        tex2.setOpacity(0);
        tex3.setOpacity(0);
        tex4.setOpacity(0);

        tex1b.setColorAll('x_1', 'var(--yellow)'),
        tex1b.setColorAll('y_1', 'var(--yellow)'),
        tex1b.setColorAll('z_1', 'var(--yellow)'),
        tex1b.setColorAll('x_2', 'var(--cyan)'),
        tex1b.setColorAll('y_2', 'var(--cyan)'),
        tex1b.setColorAll('z_2', 'var(--cyan)'),

        tex4.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)'),
        tex4.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)'),

        // Hide the equals part in tex3 initially
        Tex.setOpacity(tex3.getFirstMatch('q_1 \\cdot q_2 = '), 0);


        this.play([
            tex1.animate.setOpacity(1),
            tex2.animate.setOpacity(1),
        ], 1);

        this.wait(15.5);

        // Show the full component form result AND add coloring simultaneously
        this.play([
            Tex.setOpacityOfTex(tex2.getPartsByTex('\\ldots'), 0),
            tex3.animate.setOpacity(1),
        ], 1);

        this.wait(7.5);

        this.play([
            tex1.animate.setColorAll('x_1', 'var(--yellow)'),
            tex1.animate.setColorAll('y_1', 'var(--yellow)'),
            tex1.animate.setColorAll('z_1', 'var(--yellow)'),
            tex1.animate.setColorAll('x_2', 'var(--cyan)'),
            tex1.animate.setColorAll('y_2', 'var(--cyan)'),
            tex1.animate.setColorAll('z_2', 'var(--cyan)'),
            tex3.animate.setColorAll('x_1', 'var(--yellow)'),
            tex3.animate.setColorAll('y_1', 'var(--yellow)'),
            tex3.animate.setColorAll('z_1', 'var(--yellow)'),
            tex3.animate.setColorAll('x_2', 'var(--cyan)'),
            tex3.animate.setColorAll('y_2', 'var(--cyan)'),
            tex3.animate.setColorAll('z_2', 'var(--cyan)'),
            tex1b.animate.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)'),
            tex1b.animate.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)'),
        ], 1);

        this.wait(1);

        this.play([
            tex1.animate.setOpacity(0),
            tex1b.animate.setOpacity(1),

            tex3.animate.setColorAll('x_1', 'var(--yellow)'),
            tex3.animate.setColorAll('y_1', 'var(--yellow)'),
            tex3.animate.setColorAll('z_1', 'var(--yellow)'),
            tex3.animate.setColorAll('x_2', 'var(--cyan)'),
            tex3.animate.setColorAll('y_2', 'var(--cyan)'),
            tex3.animate.setColorAll('z_2', 'var(--cyan)'),
            tex1b.animate.setColorAll('\\vec{\\mathbf{v}}_1', 'var(--yellow)'),
            tex1b.animate.setColorAll('\\vec{\\mathbf{v}}_2', 'var(--cyan)'),
        ], 1);

        this.wait(1);

        // NEW: Show the scalar-vector form result
        this.play([
            tex4.animate.setOpacity(1),
        ], 1);

        this.wait(1);

        // NEW: Add coloring to scalar-vector form result
        this.play([

        ], 1);

        this.wait(1);
        
    }
} 