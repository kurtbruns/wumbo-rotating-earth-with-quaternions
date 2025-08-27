import { Quaternion, Scene3D, Value, Vector2, Vector3 } from "../../vector/src";
import { EarthScene } from "../EarthScene";

export class EarthSLERP extends EarthScene {
    constructor() {
        super({
            cameraOrientation: new Quaternion(0,0,0,-1),
            cameraPosition: new Vector3(0,0,4),
            q: Quaternion.identity(),
            drawAxes: false,

        });

        // this.showQuaternionTex(this.q, true);

        this.drawSphere(new Value(1));
        // this.drawSphereOutline();
        // this.drawQuaternionCube(this.q, 1, {opacity: 0.25});

        // let axisQuaternion = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), 23.5/180*Math.PI);
        // this.drawCircle(axisQuaternion);
        // this.drawCircle();

        let r = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI);


        // let q0 = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), -23.5/180*Math.PI)
        // .multiply(this.q)
        // this.q.set(q0)


        let q0 = this.q.multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI/6));
        let q1 = this.q.multiply(r);
        let q2 = q1.multiply(r);
        let q3 = q2.multiply(r);
        let q4 = q3.multiply(r);


        let qFinal = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), 0.1*2*Math.PI)

        this.q.set(q0);


        let axis = new Vector3(1, 0, 0);
        let angle = 5/24*Math.PI;

        this.camera.rotate(axis, -Math.PI/4 - 2*angle);

        this.reset = () => {
            this.q.set(q2);
            // this.q.set(q2)
            // this.camera.rotate(axis, angle);
        }
        this.reset();

        this.wait()

        this.play([
            this.q.animate.slerp(qFinal),
            this.camera.animate.rotate(axis, -1.7*angle)
        ], 4)

        this.wait()

        // this.wait();

    }

    // drawCircle(r:Quaternion = Quaternion.identity()) {
    //     let longs = this.generateCircle(36, r);

    //     let opacity = 0.5;
    //     for (let i = 0; i < longs.length; i++) {
    //         let path = this.viewPort.frame.path();
    //         path.setAttribute('stroke', 'var(--yellow)');
    //         path.setAttribute('stroke-width', '1.5px');
    //         path.setAttribute('stroke-opacity', `${opacity}`)
    //         path.addDependency(this.camera, this.q);
    //         path.update = () => {

    //             let lastVisible = false;
    //             let d = '';
    //             for (let j = 0; j < longs[i].length; j++) {

    //                 let point = longs[i][j].copy();
    //                 // let t = point.apply(this.q);
    //                 let t = point;

    //                 let distance = this.camera.position.dot(t);

    //                 if (distance > 1) { 
    //                     let v = this.camera.projectPoint(t);
    //                     let u = this.viewPort.plot.SVGToRelative(v);

    //                     if (lastVisible) {
    //                         d += `L ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
    //                     } else {
    //                         d += `M ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
    //                         lastVisible = true;
    //                     }
    //                 } else {
    //                     lastVisible = false;
    //                 }
    //             }

    //             path.d = d;
    //         }
    //         path.update();
    //     }
    // }

    // generateCircle(lats: number, r: Quaternion ): Vector3[][] {

    //     let points: Vector3[][] = [];

    //     let slice: Vector3[] = [];


    //     for (let latIndex = 0; latIndex <= lats; latIndex++) {

    //         let lat = (Math.PI / 2) - (Math.PI * latIndex / lats);

    //         let p = Scene3D.convertSphericalToCartesian(lat, 0);

    //         slice.push(p.apply(r));

    //     }

    //     for (let latIndex = 0; latIndex <= lats; latIndex++) {

    //         let lat = (Math.PI / 2) - (Math.PI * latIndex / lats);

    //         let p = Scene3D.convertSphericalToCartesian(lat, Math.PI);

    //         slice.push(p.apply(r));

    //     }

    //     points.push(slice);

    //     return points;
    // }
}