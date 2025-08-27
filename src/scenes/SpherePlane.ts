import { Quaternion, Vector3 } from "../vector/src";
import { SphereScene } from "./SphereScene";

export class SpherePlane extends SphereScene {

    constructor() {

        super({
            drawAxes: true,
            cameraPosition: new Vector3(0, 0, -6)
        });

        this.reset = () => {
            this.displayTex.setAttribute('opacity', '0');
        }
        this.reset();

        this.play([
            this.axes.animate.setOpacity(0),
        ])

        this.play([
            this.camera.animate.change(Quaternion.identity(), 5),
            this.displayTex.animate.setOpacity(1),
        ], 3)

    }

    // TODO:
    drawPlane(v:Vector3) {

        let path = this.viewPort.frame.path();
        path.setAttribute('stroke', 'var(--medium)');
        path.setAttribute('fill', 'var(--faint)');

        path.addDependency(v);
        path.update = () => {
            
            let d = '' // TODO: svg path string
 
            // TODO: draw plane 

            path.d = d;

        }


    }



}