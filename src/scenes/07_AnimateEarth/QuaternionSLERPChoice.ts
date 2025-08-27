import { QuaternionSLERPBase } from "./QuaternionSLERPBase";

export class QuaternionSLERPChoice extends QuaternionSLERPBase {
    constructor() {
        super(false); // shortestPath = false
        
        let space = 8;

        let g = this.frame.group();

        // Add Tex showing the choice between the actual quaternion values in separate lines
        let titleTex = this.frame.tex(`\\text{Choose between:}`);
        titleTex.setAttribute('font-size', '18px');
        titleTex.moveTo(this.frame.width / 2, this.frame.height * 0.75);
        titleTex.drawBackground(true, 'var(--background)', space);
        titleTex.alignCenter();
        g.appendChild(titleTex);

        let q2Tex = this.frame.tex(`q_2 = ${this.rightSphere.q.toFormattedString()}`);
        q2Tex.setAttribute('font-size', '18px');
        q2Tex.moveTo(this.frame.width / 2, this.frame.height * 0.75 + 40);
        q2Tex.drawBackground(true, 'var(--background)', space);
        q2Tex.alignCenter();
        g.appendChild(q2Tex);

        let orTex = this.frame.tex(`\\text{or}`);
        orTex.setAttribute('font-size', '18px');
        orTex.moveTo(this.frame.width / 2, this.frame.height * 0.75 + 70);
        orTex.drawBackground(true, 'var(--background)', space);
        orTex.alignCenter();
        g.appendChild(orTex);

        let negQ2Tex = this.frame.tex(`q_2 = ${this.rightSphere.q.negate().toFormattedString()}`);
        negQ2Tex.setAttribute('font-size', '18px');
        negQ2Tex.moveTo(this.frame.width / 2, this.frame.height * 0.75 + 100);
        negQ2Tex.drawBackground(true, 'var(--background)', space);
        negQ2Tex.alignCenter();
        g.appendChild(negQ2Tex);

        let negQ2TexCopy = this.frame.tex(`q_2 = ${this.rightSphere.q.negate().toFormattedString()}`);
        negQ2TexCopy.setAttribute('font-size', '18px');
        negQ2TexCopy.moveTo(this.frame.width / 2, this.frame.height * 0.75 + 100);
        negQ2TexCopy.drawBackground(true, 'var(--background)', space);
        negQ2TexCopy.alignCenter();

        this.reset = () => {

            negQ2TexCopy.setAttribute('opacity', '0')
            g.setAttribute('opacity', '0')

            this.clear();

            this.wait();

            this.play([
                g.animate.setOpacity(1),
                negQ2TexCopy.animate.setOpacity(1)
            ], 1.0)

            this.wait(3);

            this.play([
                negQ2TexCopy.animate.alignParts(this.rightSphere.displayTex, 'q_2 ='),
                this.rightSphere.displayTex.animate.setOpacity(0)
            ], 1.5)

            this.play([
                g.animate.setOpacity(0)
            ], 1.0)

            this.wait()

        }
        this.reset();

    }
} 