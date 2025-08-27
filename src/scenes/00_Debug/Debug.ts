import { Circle, Group, interpolateColor, Line, Path, Point, Quaternion, Scene3D, Shape, StringValue, Tex, Value, Vector2, Vector3 } from "../../vector/src";
import { SphereOrientationSideBySide } from "../SphereOrientationSideBySide";
import { SphereScene } from "../SphereScene";

export class Debug extends SphereOrientationSideBySide {

    constructor() {

        super();

        let size = 16;
        let spacing = 100;
        for(let y = 100; y < this.frame.height; y += 100) {
            let rotationTex2= this.frame.tex(`r = \\cos \\left( \\frac{\\pi}{4} \\right) + \\sin \\left( \\frac{\\pi}{4} \\right) \\left( 0i + 0j + 1k \\right)`);
            rotationTex2.setAttribute('font-size', `${size}px`);
            rotationTex2.setColorAll('\\frac{\\pi}{4}', '#72D6BF')
            rotationTex2.setColorAll(`\\left( 0i + 0j + 1k \\right)`, 'var(--pink)')
            rotationTex2.drawBackground(true, 'var(--background)', 6)
            rotationTex2.moveTo(50, y)
            size += 2;

            let braceLabelGroup = this.frame.group();
            this.left.plot.displayBraceLabel(rotationTex2.getPartsByTex(`\\cos \\left( \\frac{\\pi}{4} \\right) + \\sin \\left( \\frac{\\pi}{4} \\right) \\left( xi + yj + zk \\right)`),
            `\\text{Rotate around the }z\\text{-axis by 90 degrees}`, {
                reverse: true,
                space: 6,
                color: 'var(--font-color)',
                buff: 36,
                position: 'above',
                group: braceLabelGroup
            })

        }

        this.wait(3);


    }
}
