import { Circle, Point, Quaternion, Scene3D, StringValue, Vector3 } from '@kurtbruns/vector';
import { EarthScene } from "../EarthScene";
import { latLongToVector3 } from "./StarMap";

export class StarMapWithEarthPerspectiveChange extends EarthScene {


    constructor() {

        let orientation = new Quaternion(1, 0, 0, 0)
        .multiply(Quaternion.fromAxisAngle(new Vector3(1, 0, 0), Math.PI))

        super({
            // showQuaternionTex: false,
            // cameraOrientation:  new Quaternion(0, 0, 0, -1),
            cameraOrientation: new Quaternion(0.673, 0.384, 0.313, -0.550), 
            cameraPosition: new Vector3(29.116, -5.926, -17.577),

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


        this.drawOuterSphere(s);
        

       // Fetch both JSON files in parallel using Promise.all
       Promise.all([
        fetch('./stars.6.json').then(response => response.json()),
        fetch('./starnames.json').then(response => response.json())
    ])
        .then(([starsData, starNames]) => {

            // Iterate over each star (feature) in starsData
            starsData.features.forEach(feature => {
                const id = feature.id;
                const magnitude: number = Number(feature.properties.mag);
                const colorIndex = feature.properties.bv;
                const [longitude, latitude] = feature.geometry.coordinates;

                let maxRadius = 2;
                let minRadius = 0.1;

                // Optional: Log the magnitude if it's less than 1
                if (magnitude < 1) {
                    // console.log(magnitude);
                }

                // Calculate the radius based on the magnitude
                if (magnitude < 4) {
                    const minMag: number = -1.5;
                    const maxMag: number = 6.5;
                    const normMag: number = (magnitude - minMag) / (maxMag - minMag);
                    const invertedNormMag: number = 1 - normMag;
                    const scaledRadius: number = minRadius + (invertedNormMag * (maxRadius - minRadius));

                    let v = latLongToVector3(latitude, longitude, s);
                    this.orientPoint(v, this.q)
                
                    this.drawPoint(v, { radius: scaledRadius });

                    // Find the proper name of the star using its Hipparcos number (id)
                    // if (starNames[id] && magnitude < 2 ) {
                    //     // let vShift = this.orientPoint(latLongToVector3(latitude + 5, longitude + 5, s), this.q);
                    //     // const properName = starNames[id].name;
                    //     // this.tex(vShift, `\\small \\text{${properName}}`)
                    //     // console.log(`Star ID: ${id}, Proper Name: ${properName}`, latitude, longitude, v.toConstructor());
                    // }

                }


            });

            this.redrawEarthBackground();

        })
        .catch(error => {
            console.error('Error fetching or processing the data:', error);
        });



        this.play([
            this.camera.animate.slerp(new Quaternion(0.715, 0.489, 0.282, -0.412))
        ], 4)

        this.play([
            this.q.animate.rotateBy(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI/2))
        ], 4)


    }

    redrawEarthBackground() {

        let w = new Vector3();
        // this.drawPoint(w, { color: 'var(--main)' });
        w.addDependency(this.camera);
        w.update = () => {


            let q = this.camera.orientation;
            let c = this.camera.orientation.conjugate();

            const forward = c.multiply(new Quaternion(0, 0, 0, -1)).multiply(q);
            const up = c.multiply(new Quaternion(0, 0, 1, 0)).multiply(q);
            const right = forward.toVector3().cross(up.toVector3());

            // Flip again because it creates bad behavior if ya' don't.
            w.set(new Vector3(right.x, right.y, -right.z));
        }
        w.update();

        let background = this.viewPort.frame.circle(0, 0, 0);
        background.setAttribute('stroke', 'none')
        background.setAttribute('fill', 'var(--background)')
        background.setAttribute('opacity', '0.8')
        background.addDependency(this.origin, this.camera.position, w);
        background.update = () => {

            let d = this.camera.position.length();

            // https://stackoverflow.com/questions/21648630/radius-of-projected-sphere-in-screen-space#:~:text=Let%20the%20sphere%20have%20radius,can%20be%20written%20as%20f%20.
            let s = d*1/Math.sqrt(d*d - 1);
            // let s = 1;

            let center = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(this.origin));
            let x = this.viewPort.plot.SVGToRelative(this.camera.projectPoint(w.copy().scale(s)));

            background.cx = center.x;
            background.cy = center.y;
            background.r = Math.hypot(x.y - center.y, x.x - center.x);
        }
        background.update();
        this.background.appendChild(background)

    }

    drawPoint(p: Vector3, options: { color?: string, opacity?: number, radius?: number, scale?: boolean, s?: number, colorValue?: StringValue, } = {}) : Circle {

        let defaultOptions = {
            color: 'var(--font-color)',
            opacity: 1,
            radius: 3,
            scale: false,
            s: 150,
        };

        options = { ...defaultOptions, ...options };

        let q = this.camera.projectPoint(p);
        q.addDependency(p, this.camera);
        q.update = () => {
            q = this.camera.projectPoint(p);
        }

        let vbox = this.viewPort.frame.viewBox.split(/[\s,]+/).map(Number)
        let c = this.viewPort.frame.circle(0, 0, 3);
        c.setAttribute('fill', options.color);
        c.setAttribute('opacity', `${options.opacity}`);
        c.addDependency(q, options.colorValue)
        c.update = () => {
            let relativePoint = this.viewPort.plot.SVGToRelative(q.x, q.y);
            c.cx = relativePoint.x + vbox[0];
            c.cy = relativePoint.y + vbox[1];
            if (options.scale) {
                c.r = options.s / (q.z * q.z);
            } else {
                c.r = options.radius;
            }
            if (options.colorValue) {
                c.setAttribute('fill', options.colorValue.value)
            }
            if (q.z === 0) {
                c.setAttribute('opacity', '0')
            } else {
                c.setAttribute('opacity', '1')
            }

        }
        c.update();

        this.background.appendChild(c);

        return c;
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
                if( v.z === 0) {
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

            path.d = clip === longs.length ? "" : d ;
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

    // drawOuterSphere(r: number = 10, opacity: number = 0.1): void {

    //     let s = 72;
    //     // let verticalN = 4;
    //     // let horizontalN = 2;
    //     let verticalN = 24;
    //     let horizontalN = 12;
    //     let identity = Quaternion.identity();

    //     let longs = Scene3D.generateVerticalSlices(s, verticalN, identity);

    //     for (let i = 0; i < longs.length; i++) {
    //         let path = this.viewPort.frame.path();
    //         path.setAttribute('stroke', 'var(--medium)');
    //         path.setAttribute('stroke-width', '1.5px');
    //         path.setAttribute('stroke-opacity', `${opacity}`)
    //         path.addDependency(this.camera, this.q);
    //         path.update = () => {

    //             let lastVisible = false;
    //             let d = '';
    //             for (let j = 0; j < longs[i].length; j++) {

    //                 let point = longs[i][j].copy();
    //                 let t = point.apply(this.q).scale(r);

    //                 let v = this.camera.projectPoint(t);
    //                 let u = this.viewPort.plot.SVGToRelative(v);

    //                 if (v.z === 1) {

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

    //     let lats = Scene3D.generateHorizontalSlices(horizontalN, s, identity);


    //     for (let i = 0; i < lats.length; i++) {
    //         let path = this.viewPort.frame.path();
    //         path.setAttribute('stroke', 'var(--medium)')
    //         path.setAttribute('stroke-width', '1.5px')
    //         path.setAttribute('stroke-opacity', `${opacity}`)
    //         path.addDependency(this.camera, this.q);

    //         path.update = () => {

    //             let d = '';
    //             let lastVisible = false;

    //             for (let j = 0; j < lats[i].length; j++) {

    //                 let point = lats[i][j].copy();
    //                 let t = point.apply(this.q).scale(r);

    //                 let v = this.camera.projectPoint(t);
    //                 let u = this.viewPort.plot.SVGToRelative(v);

    //                 if (v.z === 1) {

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

}