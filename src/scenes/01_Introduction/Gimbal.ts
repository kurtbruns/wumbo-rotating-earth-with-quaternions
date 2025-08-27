import { Quaternion, Scene3D, Vector2, Vector3 } from "../../vector/src";
import { QScene } from "../QScene";


export class Gimbal extends QScene {
    constructor() {

        let cameraOrientation = new Quaternion(1, 0, 0, 0);
        let cameraPosition = new Vector3(0, 0, -5);

        super({
            drawAxes: false,
            labelAxes: false,
            drawBasisVectors: false,
            cameraOrientation: cameraOrientation,
            cameraPosition: cameraPosition
        });

        // this.drawCircleOrthogonalToVector(new Vector3(1,0,0), 1, 1)

        // Draw green circle (inside)
        this.drawDirectionCircle(1, Quaternion.identity(), new Vector3(1, 0, 0)).setAttribute('stroke', 'var(--green)')
        this.drawDirectionCircle(1.05, Quaternion.identity(), new Vector3(1, 0, 0)).setAttribute('stroke', 'var(--green)')

        // Draw red circle (no changes needed)
        this.drawDirectionCircle(1.1, Quaternion.identity(), new Vector3(0, 1, 0)).setAttribute('stroke', 'var(--red)')
        this.drawDirectionCircle(1.15, Quaternion.identity(), new Vector3(0, 1, 0)).setAttribute('stroke', 'var(--red)')

        // Draw blue circle (outside)
        this.drawDirectionCircle(1.2, Quaternion.identity(), new Vector3(0, 0, 1)).setAttribute('stroke', 'var(--blue)')
        this.drawDirectionCircle(1.25, Quaternion.identity(), new Vector3(0, 0, 1)).setAttribute('stroke', 'var(--blue)')

    }


    drawDirectionCircle(radius: number, r: Quaternion = Quaternion.identity(), direction: Vector3 = new Vector3(0, 0, 1)) {

        let longs = this.generateCircle(72, radius);
        let opacity = 0.75;
        let path = this.background.path();
        path.setAttribute('stroke', 'var(--font-color)');
        path.setAttribute('stroke-width', '1.5px');
        path.setAttribute('stroke-opacity', `${opacity}`)
        path.addDependency(this.camera, this.q, this.normal, r);
        path.update = () => {

            let p = this.q.transform(direction);
            let q = Quaternion.rotationToVector(p);
            let clip = 0;
            let pathStarted = false;
            let d = '';

            for (let j = 0; j < longs.length; j++) {

                let point = longs[j].copy();
                let t = point.apply(q);

                let v = this.camera.projectPoint(t);
                if (v.z === 0) {
                    clip++;
                }

                let u = this.viewPort.plot.SVGToRelative(v);

                if (pathStarted) {
                    d += `L ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                } else {
                    d += `M ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                    pathStarted = true; // Start the path
                }
            }


            path.d = clip > longs.length / 2 ? "" : d;
            // path.d = d ;
        }
        path.update();


        return path;
        // this.viewPort.pathArrow(path)
        // path.attatchArrow(this.viewPort.defs, true);

    }


    drawCircleOrthogonalToVector(v: Vector3, radius: number, s: number, drawLine: boolean = true, drawAtTip = true): Quaternion {

        let offset = Quaternion.fromAxisAngle(v, (0.4) * 2 * Math.PI);
        let u = offset.multiply(Quaternion.rotationToVector(v));

        let pos = new Vector3();
        if (drawAtTip) {
            pos = v.copy().scale(s)
        }

        let p = this.drawCircle(radius, u, pos)
        console.log(p)

        return u;
    }

}