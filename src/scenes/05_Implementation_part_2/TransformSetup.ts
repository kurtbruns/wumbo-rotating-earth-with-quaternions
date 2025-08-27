import { Group, interpolateColor, Line, Quaternion, Tex, Vector2, Vector3 } from '@kurtbruns/vector';
import { TransformScene } from "./TransformScene";

export class TransformSetup extends TransformScene {

    constructor() {
        super();
        
        this.axis.set(new Vector3(1, 1, 1).scale(0.9))
        this.displayAxis.setOpacity(0);
        // let axisVector = this.vector(this.origin, axis, 'var(--pink)');
        // let axisCone = this.drawStaticConeWithLine(0.075, axis, 'var(--pink)');
        
        // Add text labels for the transformation formulas
        let f1 = this.viewPort.frame.tex('f(p) = q \\cdot p').alignCenter();
        f1.setAttribute('font-size', '18px');
        f1.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50)
        let f2 = this.viewPort.frame.tex('f(p) = q \\cdot p \\cdot q^{-1}').alignCenter();
        f2.setAttribute('font-size', '18px');
        f2.setOpacity(0);
        f2.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50)
        Tex.alignBy(f2, f1, 'f(p) = q \\cdot p');


        // this.drawCube(1);
        // axisCone.setOpacity(0),

        let startQTex = this.viewPort.frame.tex('');
        startQTex.setAttribute('font-size', '18px');
        startQTex.moveTo(this.viewPort.frame.width / 2, 50)
        startQTex.replace('q=' + `1.00 + 0.00 i + 0.00 j + 0.00 k`);
        startQTex.alignCenter();
        
        let tempQTex = this.viewPort.frame.tex('');
        tempQTex.setAttribute('font-size', '18px');
        tempQTex.moveTo(this.viewPort.frame.width / 2, 50)
        tempQTex.replace('q=' + `\\cos (\\theta)+\\sin (\\theta) (x i+y j+z k) `);
        tempQTex.setColorAll('\\theta', '#72D6BF');
        tempQTex.setColorAll('(x i+y j+z k)', 'var(--pink)');
        tempQTex.alignCenter();

        this.reset = () => {

            this.clear();

            this.qTex.setOpacity(0);
            this.cube.setAttribute('opacity', '0');
            this.topFacePath.setAttribute('opacity', '0');
            tempQTex.setOpacity(0);
            f1.setOpacity(0);

            this.wait(8.5)

            this.play([
                tempQTex.animate.setOpacity(1),
                startQTex.animate.setOpacity(0),
            ], 1)

            this.wait(4)

            this.play([
                this.displayAxis.animate.setOpacity(1),
            ], 1)

            this.wait(5)

            this.play([
                this.axis.animate.moveTo(this.axis.copy().normalize()),
                this.qTex.animate.setOpacity(1),
                tempQTex.animate.setOpacity(0),
            ], 3)

            this.wait(4)

            this.play([
                this.cube.animate.setOpacity(1),
            ], 3)
            this.wait(2)
            this.play([
                this.topFacePath.animate.setOpacity(1),
            ], 3)
            this.wait(2)
        }

        this.reset();
    }

    drawCube(scale: number = 0.75) {
        // Create cube vertices (from origin to [1,1,1], side length 1)
        const cubeVertices = [
            new Vector3(0, 0, 0),          // 0: bottom-front-left (origin)
            new Vector3(1, 0, 0),          // 1: bottom-front-right
            new Vector3(1, 1, 0),          // 2: bottom-back-right
            new Vector3(0, 1, 0),          // 3: bottom-back-left
            new Vector3(0, 0, 1),          // 4: top-front-left
            new Vector3(1, 0, 1),          // 5: top-front-right
            new Vector3(1, 1, 1),          // 6: top-back-right (diagonal corner)
            new Vector3(0, 1, 1),          // 7: top-back-left
        ];

        // Scale the vertices
        const scaledVertices = cubeVertices.map(v => v.scale(scale));
    
        // Define edges of the cube
        const edges = [
            // Bottom face (z = -0.5)
            [0, 1], [1, 2], [2, 3], [3, 0],
            // Top face (z = 0.5)
            [4, 5], [5, 6], [6, 7], [7, 4],
            // Vertical edges connecting top and bottom faces
            [0, 4], [1, 5], [2, 6], [3, 7]
        ];

        // Draw edges
        let group = this.viewPort.frame.group();
        
        edges.forEach(([i, j]) => {
            let start = scaledVertices[i];
            let end = scaledVertices[j];

            let l = group.line(0, 0, 0, 0)
            l.setAttribute('stroke', 'var(--font-color)');
            l.setAttribute('opacity', '0.5');

            // Stroke width effect control variables
            let baseDistance = 3.667;        // Distance at which stroke width is minimum
            let strokeScaleFactor = 5;   // How dramatic the scaling is (higher = more dramatic)
            let minStrokeWidth = 1.5;    // Minimum stroke width in pixels
            let maxStrokeWidth = 3;      // Maximum stroke width in pixels

            // Opacity effect control variables
            let minOpacity = 0.3;        // Minimum opacity (far edges)
            let maxOpacity = 0.75;        // Maximum opacity (near edges)
            let opacityScaleFactor = 0.5; // How dramatic the opacity change is

            l.addDependency(this.camera);
            l.update = () => {
                let t1 = this.camera.projectPoint(start);
                let t2 = this.camera.projectPoint(end);

                let p1 = this.viewPort.plot.SVGToRelative(t1.x, t1.y);
                let p2 = this.viewPort.plot.SVGToRelative(t2.x, t2.y);

                l.x1 = p1.x;
                l.y1 = p1.y;
                l.x2 = p2.x;
                l.y2 = p2.y;
                
                // Calculate stroke width based on distance from camera
                let d1 = start.subtract(this.camera.position).length();
                let d2 = end.subtract(this.camera.position).length();
                let avgDistance = (d1 + d2) * 0.5;
                let strokeWidth = Math.max(minStrokeWidth, Math.min(maxStrokeWidth, (avgDistance - baseDistance) * strokeScaleFactor));
                
                // Calculate opacity based on distance from camera
                let opacity = Math.max(minOpacity, Math.min(maxOpacity, maxOpacity - (baseDistance - avgDistance) * opacityScaleFactor));
                l.setAttribute('stroke-width', strokeWidth.toString());
                l.setAttribute('opacity', opacity.toString());
            }
            l.update();
        });
        
        return group;
    }

}