import { Quaternion, Vector3 } from "../../vector/src";
import { SphereScene } from "../SphereScene";

export class SphereHomeBase extends SphereScene {

    constructor() {

        super({
            drawAxes: false,
            cameraPosition: new Vector3(0, 0, -5.5)
        });

        this.reset = () => {
            this.clear();
            this.play([
                this.q.animate.slerp(Quaternion.identity())
            ], 4)
        }
        this.reset();

 

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