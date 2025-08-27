import { Quaternion, Scene3D, Vector3 } from "../vector/src";
import { PropCamera } from "./PropCamera";
import { QScene } from "./QScene";

export class DebugScene extends QScene {

    propCamera: PropCamera;

    constructor() {

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

        this.drawOuterSphere(s)


        const handleKeyDown = (event: KeyboardEvent) => {

            switch (event.key) {
                case 'Enter':
                    console.log(this.camera.orientation)
                    console.log('i', this.camera.projectPoint(new Vector3(1, 0, 0), true))
                    console.log('j', this.camera.projectPoint(new Vector3(0, 1, 0), true))
                    console.log('k', this.camera.projectPoint(new Vector3(0, 0, 1), true))

                    // console.log('positiveX', this.camera.projectPoint(new Vector3(10, 0, 0), true))
                    // console.log('positiveY', this.camera.projectPoint(new Vector3(0, 10, 0), true))
                    console.log('positiveZ', this.camera.projectPoint(new Vector3(0, 0, 10), true))
                    // console.log('negativeX', this.camera.projectPoint(new Vector3(-10, 0, 0), true))
                    // console.log('negativeY', this.camera.projectPoint(new Vector3(0, -10, 0), true))
                    console.log('negativeZ', this.camera.projectPoint(new Vector3(0, 0, -10), true))

                    break;
                case ' ':
                    return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);


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