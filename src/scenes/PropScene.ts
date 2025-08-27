import { Quaternion, Scene3D, Vector3 } from "../vector/src";
import { PropCamera } from "./PropCamera";
import { QScene } from "./QScene";

export class PropScene extends QScene {

    propCamera: PropCamera;

    constructor() {

        // let cameraOrientation =  new Quaternion(0.930, -0.138, 0.337, -0.050);
        // let cameraPosition = new Vector3(3.676, 1.744, -4.409);

        let cameraOrientation =  new Quaternion(1, 0, 0, 0);
        let cameraPosition = new Vector3(0, 0, -10);
        

        super({
            drawSphere: false,
            showQuaternionTex: false,
            // cameraOrientation:  new Quaternion(0, 0, 0, -1),
            cameraOrientation: cameraOrientation,
            cameraPosition: cameraPosition,


            // cameraOrientation: new Quaternion(0.946, -0.104, 0.306, 0.016),
            // cameraPosition: new Vector3(3.495, 1.119, -4.747),

        });

        let s = 12;


        let positiveX = new Vector3(s, 0, 0);
        this.drawPoint(positiveX, { color: 'var(--green)' })

        let positiveY = new Vector3(0, s, 0);
        this.drawPoint(positiveY, { color: 'var(--red)' })

        let postiveZ = new Vector3(0, 0, s);
        this.drawPoint(postiveZ, { color: 'var(--blue)' })

        let negativeX = new Vector3(-s, 0, 0);
        this.drawPoint(negativeX, { color: 'var(--purple)' })

        let negativeY = new Vector3(0, -s, 0);
        this.drawPoint(negativeY, { color: 'var(--cyan)' })

        let negativeZ = new Vector3(0, 0, -s);
        this.drawPoint(negativeZ, { color: 'var(--orange)' })

        let positiveXCircle = this.drawCircle(1, Quaternion.identity(), positiveX);
        positiveXCircle.setAttribute('stroke', 'var(--green)');

        let positiveYCircle = this.drawCircle(1, Quaternion.identity(), positiveY);
        positiveYCircle.setAttribute('stroke', 'var(--red)');

        let positiveZCircle = this.drawCircle(1, Quaternion.identity(), postiveZ);
        positiveZCircle.setAttribute('stroke', 'var(--blue)');

        let negativeXCircle = this.drawCircle(1, Quaternion.identity(), negativeX);
        negativeXCircle.setAttribute('stroke', 'var(--purple)');

        let negativeYCircle = this.drawCircle(1, Quaternion.identity(), negativeY);
        negativeYCircle.setAttribute('stroke', 'var(--cyan)');

        let negativeZCircle = this.drawCircle(1, Quaternion.identity(), negativeZ);
        negativeZCircle.setAttribute('stroke', 'var(--orange)');

        this.background.appendChild(positiveXCircle)
        this.background.appendChild(positiveYCircle)
        this.background.appendChild(positiveZCircle)
        this.background.appendChild(negativeXCircle)
        this.background.appendChild(negativeYCircle)
        this.background.appendChild(negativeZCircle)

        
        this.propCamera = new PropCamera(new Vector3(0, 0, 0));
        let path = this.drawCamera();


        this.drawOuterSphere(s)

        // this.play([
        //     // this.propCamera.orientation.animate.rotate(new Vector3(1, 0, 0), Math.PI/2)
        //     // this.propCamera.orientation.animate.slerp(this.camera.orientation)
        // ], 4)


        // this.propCamera.orientation.addDependency(this.camera.orientation, this.camera.position);
        // this.propCamera.orientation.update = () => {

        //     let w = this.camera.orientation;
        //     let p = this.camera.position;

        //     this.propCamera.orientation.set(w.conjugate());
        //     // this.propCamera.orientation.set(this.camera.orientation);


        //     this.propCamera.position.set(new Vector3(p.x, p.y, p.z));
        // }

        // this.play([
        //     this.propCamera.orientation.animate.slerp(cameraOrientation.copy().conjugate()),
        //     this.propCamera.position.animate.moveTo(cameraPosition.copy()),
        // ], 3)

        // this.play([
        //     this.camera.animate.slerp(new Quaternion(0.715, 0.489, 0.282, -0.412))
        // ], 4)










        // this.play([
        //     this.propCamera.orientation.animate.rotate(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), -Math.PI/4))
        // ], 3)

        // console.log(new Quaternion(0, 0, 0, -1).transform(new Vector3(0, 0, 1)))

        // this.play([
        //     // this.propCamera.orientation.animate.slerp(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI/2)),
        //     this.propCamera.orientation.animate.slerp(new Quaternion(0, 0, 0, -1)),
        //     this.propCamera.position.animate.moveTo(new Vector3(0, 0, 2)),
        // ], 3)

        // this.play([
        //     // this.propCamera.orientation.animate.slerp(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI/2)),
        //     this.camera.animate.rotate(new Vector3(1, 0, 0), Math.PI/2)
        // ], 3)

        // this.wait();

        // this.play([
        //     // this.propCamera.orientation.animate.slerp(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI/2)),
        //     this.camera.animate.rotate(new Vector3(1, 0, 0), Math.PI/2)
        // ], 3)

        // this.wait();

    }


    /**
     * Orients the point using the rotation described by the quaternion.
     */
    drawQuaternionCube(q: Quaternion, c: number = 1, options: { strokeColor?: string, opacity?: number, points?: boolean } = {}) {

        let defaultOptions = {
            strokeColor: 'var(--medium)',
            opacity: 0.5,
            points: false
        }

        options = { ...defaultOptions, ...options };

        let cubeOpacity = options.opacity;
        let t1 = new Vector3(-c, -c, c);
        let t2 = new Vector3(c, -c, c);
        let t3 = new Vector3(c, c, c);
        let t4 = new Vector3(-c, c, c);

        this.orientPoint(t1, q);
        this.orientPoint(t2, q);
        this.orientPoint(t3, q);
        this.orientPoint(t4, q);

        this.path({ opacity: '0.5', stroke: 'var(--blue)' }, t1, t2, t3, t4, t1)

        this.background.appendChild(this.line(t1, t2, options.strokeColor, options.opacity));
        this.background.appendChild(this.line(t2, t3, options.strokeColor, options.opacity));
        this.background.appendChild(this.line(t3, t4, options.strokeColor, options.opacity));
        this.background.appendChild(this.line(t4, t1, options.strokeColor, options.opacity));

        // bottom

        let b1 = new Vector3(-c, -c, -c);
        let b2 = new Vector3(c, -c, -c);
        let b3 = new Vector3(c, c, -c);
        let b4 = new Vector3(-c, c, -c);

        this.orientPoint(b1, q);
        this.orientPoint(b2, q);
        this.orientPoint(b3, q);
        this.orientPoint(b4, q);

        this.path({ opacity: '0.2', stroke: 'var(--red)' }, t3, t4, b4, b3, t3)
        this.path({ opacity: '0.2', stroke: 'var(--green)' }, t2, t3, b3, b2, t2)



        // this.background.appendChild(this.line(b1, b2, options.strokeColor, options.opacity));
        // this.background.appendChild(this.line(b2, b3, options.strokeColor, options.opacity));
        // this.background.appendChild(this.line(b3, b4, options.strokeColor, options.opacity));
        // this.background.appendChild(this.line(b4, b1, options.strokeColor, options.opacity));

        // this.background.appendChild(this.line(t1, b1, options.strokeColor, options.opacity));
        // this.background.appendChild(this.line(t2, b2, options.strokeColor, options.opacity));
        // this.background.appendChild(this.line(t3, b3, options.strokeColor, options.opacity));
        // this.background.appendChild(this.line(t4, b4, options.strokeColor, options.opacity));

    }


    drawCamera(config = {}) {

        let defaultConfig = { 'stroke': 'var(--main)', 'stroke-width': '1.5px', 'fill': 'none', 'opacity': '0.5' };

        config = { ...defaultConfig, ...config };

        let p = this.viewPort.frame.path();
        p.setAttribute('fill', config['fill']);
        p.setAttribute('stroke', config['stroke']);
        p.setAttribute('stroke-width', config['stroke-width']);
        p.setAttribute('opacity', config['opacity']);


        p.addDependency(this.camera, this.camera.orientation, this.camera.position, this.propCamera.orientation, this.propCamera.position)
        p.update = () => {

            let d = "";
            for (let i = 0; i < this.propCamera.body.length; i++) {
                let polygon = this.propCamera.body[i];
                for (let j = 0; j < polygon.length; j++) {

                    let v = new Vector3(...polygon[j]);
                    let t = this.propCamera.orientation.transform(v).add(this.propCamera.position);
                    let u = this.camera.projectPoint(t);
                    let r = this.viewPort.plot.SVGToRelative(u.x, u.y);

                    d += `${j === 0 ? "M" : "L"} ${r.x.toFixed(2)} ${r.y.toFixed(2)} `

                }
                d += "Z ";
            }

            for (let i = 0; i < this.propCamera.handle.length; i++) {
                let polygon = this.propCamera.handle[i];
                for (let j = 0; j < polygon.length; j++) {

                    let v = new Vector3(...polygon[j]);
                    let t = this.propCamera.orientation.transform(v).add(this.propCamera.position);
                    let u = this.camera.projectPoint(t);
                    let r = this.viewPort.plot.SVGToRelative(u.x, u.y);

                    d += `${j === 0 ? "M" : "L"} ${r.x.toFixed(2)} ${r.y.toFixed(2)} `

                }
                d += "Z ";
            }

            for (let i = 0; i < this.propCamera.lens.length; i++) {
                let polygon = this.propCamera.lens[i];
                for (let j = 0; j < polygon.length; j++) {

                    let v = new Vector3(...polygon[j]);
                    let t = this.propCamera.orientation.transform(v).add(this.propCamera.position);
                    let u = this.camera.projectPoint(t);
                    let r = this.viewPort.plot.SVGToRelative(u.x, u.y);

                    d += `${j === 0 ? "M" : "L"} ${r.x.toFixed(2)} ${r.y.toFixed(2)} `

                }
                d += "Z ";
            }

            p.d = d;
        }
        p.update();

        return p;

    }

    toDependentVector(q: Quaternion): Vector3 {
        let v = new Vector3();
        v.addDependency(q);
        v.update = () => {
            v.set(q.toVector3());
        };
        v.update();
        return v;
    }

    transform(p: Quaternion): Quaternion {
        let copy = p.copy();
        p.addDependency(this.q);
        p.update = () => {
            p.set((this.q.multiply(copy)).multiply(this.q.inverse()))
        }
        p.update();
        return p;
    }

    drawCircle(radius: number, r: Quaternion = Quaternion.identity(), pos: Vector3 = new Vector3(0, 0, 0)) {
        let longs = this.generateCircle(72, radius);

        let opacity = 0.5;
        let path = this.background.path();
        path.setAttribute('stroke', 'var(--font-color)');
        path.setAttribute('stroke-width', '1.5px');
        path.setAttribute('stroke-opacity', `${opacity}`)
        path.addDependency(this.camera, this.q, r);
        path.update = () => {

            let clip = 0;
            let lastVisible = false;
            let d = '';
            for (let j = 0; j < longs.length; j++) {

                let point = longs[j].copy();
                // let point = longs[longs.length - 1 - j].copy();

                let t = point.apply(Quaternion.rotationToVector(pos)).add(pos);

                let v = this.camera.projectPoint(t);
                if (v.z === 0) {
                    clip++;
                }

                let u = this.viewPort.plot.SVGToRelative(v);

                if (lastVisible) {
                    d += `L ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                } else {
                    d += `M ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                    lastVisible = true;
                }

            }

            path.d = clip === longs.length ? "" : d;
            // path.d = d ;
        }
        path.update();

        return path;
        // this.viewPort.pathArrow(path)
        // path.attatchArrow(this.viewPort.defs, true);

    }

    generateCircle(longs: number, radius: number): Vector3[] {
        let slice: Vector3[] = [];

        let end = Math.floor(1 * longs);
        for (let longIndex = 0; longIndex <= end; longIndex++) {
            let long = (2 * Math.PI * longIndex / longs);

            let p = Scene3D.convertSphericalToCartesian(0, long).scale(radius);

            slice.push(p);
        }

        return slice;
    }

}