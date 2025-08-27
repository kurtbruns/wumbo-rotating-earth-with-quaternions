import { Quaternion, Scene3D, Vector3 } from "../../vector/src";
import { QScene } from "../QScene";


/**
 * Converts latitude and longitude to a Vector3 point on a sphere.
 * @param {number} latitude - Latitude in degrees.
 * @param {number} longitude - Longitude in degrees.
 * @param {number} radius - Radius of the sphere.
 * @returns {Vector3} - The point on the sphere as a Vector3.
 */
export function latLongToVector3(latitude: number, longitude: number, radius: number): Vector3 {
    // Convert latitude and longitude from degrees to radians
    const latRad = (latitude * Math.PI) / 180;
    const lonRad = (longitude * Math.PI) / 180;

    // Calculate the x, y, z coordinates
    const z = radius * Math.sin(latRad);
    const x = radius * Math.cos(latRad) * Math.cos(lonRad);
    const y = radius * Math.cos(latRad) * Math.sin(lonRad);

    return new Vector3(x, y, z);
}

export type GeoJSON = {
    type: "FeatureCollection";
    features: Array<{
        type: "Feature";
        id: string; // Hipparcos number
        properties: {
            mag: string; // Apparent magnitude
            bv: string;  // b-v color index
        };
        geometry: {
            type: "Point";
            coordinates: [number, number]; // [longitude, latitude]
        };
    }>;
};

export class StarMap extends QScene {

    constructor() {

        let orientation = new Quaternion(1, 0, 0, 0)
        .multiply(Quaternion.fromAxisAngle(new Vector3(1, 0, 0), Math.PI))
        

        super({
            cameraOrientation: orientation,
            cameraPosition: new Vector3(0, 0, 10),
            cameraTrackBallInvert: true,
            cameraTrackBallRadius: 1,
            drawBasisVectors: false,
            labelAxes: false,
            drawAxes: false,
            showQuaternionTex: false,
        });

        let s = 10;

        let drawCircles = true;
        if (drawCircles) {
            // this.drawOuterCircles(s);
        }

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
            })
            .catch(error => {
                console.error('Error fetching or processing the data:', error);
            });


            this.play([
                this.q.animate.rotateBy(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), -Math.PI))
            ], 30, 'linear')

            this.play([
                this.q.animate.rotateBy(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), -Math.PI))
            ], 30, 'linear')


    }

    registerEventListeners(r = 10, invert = false) {

        
        let isDragging = false;
        let isSpaceDown = false;
        let upAxis: 'x' | 'y' | 'z' = 'z';
        let prevX: number = 0;
        let prevY: number = 0;
        let bbox = this.viewPort.frame.root.getBoundingClientRect();


        /**
         * Projects the coordinates onto the northern hemisphere of a sphere.
         */
        const projectOnTrackball = (touchX: number, touchY: number) => {

            // let d = this.camera.position.length();
            // console.log(d)
            // let r = d*1/Math.sqrt(d*d - 1);

            // let x = touchX / window.innerWidth * 2 - 1;
            // let y = -(touchY / window.innerHeight * 2 - 1);

            let x = (invert ? 1 : -1) * (touchX - bbox.left - bbox.width / 2) / bbox.height;
            let y = (invert ? 1 : -1) * (touchY - bbox.top - bbox.height / 2) / bbox.height;
            let z = 0.0;
            let distance = x * x + y * y;
            if (distance <= r * r / 2) {
                // Inside sphere
                z = Math.sqrt(r * r - distance);

            } else {
                // On hyperbola
                z = (r * r / 2) / Math.sqrt(distance);

            }

            return new Vector3(-x, y, z).normalize();
        }

        // Mouse down handler
        const handleMouseDown = (event: MouseEvent) => {
            if (this.viewPort.frame.root.contains(event.target as HTMLElement)) {
                isDragging = true;
                bbox = this.viewPort.frame.root.getBoundingClientRect();
                this.viewPort.plot.setCTM();
                this.viewPort.plot.setBoundingRect();
                prevX = event.clientX;
                prevY = event.clientY;
            }
        };

        // Mouse move handler
        const handleMouseMove = (event: MouseEvent) => {

            if (isSpaceDown && isDragging && (event.clientX !== prevX || event.clientY !== prevY)) {

                const v1 = projectOnTrackball(prevX, prevY);
                const v2 = projectOnTrackball(event.clientX, event.clientY);

                const q1 = Quaternion.fromVector(v1);
                const q2 = Quaternion.fromVector(v2);

                let r = q2.multiply(q1.conjugate());

                // Convert the global rotation to a local rotation
                let localRotation = this.camera.orientation.conjugate().multiply(r).multiply(this.camera.orientation).normalize();

                // Apply the local rotation to the camera's orientation
                this.camera.position.apply(localRotation);
                this.camera.orientation = this.camera.orientation.multiply(localRotation.inverse());


            } else if (isDragging && (event.clientX !== prevX || event.clientY !== prevY)) {

                let up_vec: Vector3;
                let right_vec: Vector3;

                if (upAxis === 'x') {

                    up_vec = new Vector3(0, 0, 1);
                    right_vec = new Vector3(0, -1, 0);

                    let q = this.camera.orientation.conjugate();
                    let c = q.conjugate();
                    let up = q.multiply(Quaternion.fromVector(up_vec)).multiply(c);
                    let forward = q.multiply(Quaternion.fromVector(right_vec)).multiply(c);

                    let scalar = 200;

                    // TODO: note this is different for some reason
                    let r = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), (event.clientX - prevX) / scalar);
                    let s = Quaternion.fromAxisAngle(up.toVector3().cross(forward.toVector3()).normalize(), (event.clientY - prevY) / scalar);

                    let u = r.multiply(s).normalize();

                    this.camera.position.apply(u);
                    this.camera.orientation = this.camera.orientation.multiply(u.inverse()).normalize();

                } else if (upAxis === 'y') {

                    up_vec = new Vector3(0, 1, 0);
                    right_vec = new Vector3(0, 0, 1);

                    let q = this.camera.orientation.conjugate();
                    let c = q.conjugate();
                    let up = q.multiply(Quaternion.fromVector(up_vec)).multiply(c);
                    let forward = q.multiply(Quaternion.fromVector(right_vec)).multiply(c);

                    let scalar = 200;
                    let r = Quaternion.fromAxisAngle(up.toVector3().cross(forward.toVector3()).normalize(), (event.clientY - prevY) / scalar);
                    let s = Quaternion.fromAxisAngle(up_vec, (event.clientX - prevX) / scalar);

                    let u = s.multiply(r).normalize();

                    this.camera.position.apply(u);
                    this.camera.orientation = this.camera.orientation.multiply(u.inverse()).normalize();

                } else {

                    up_vec = new Vector3(0, 0, 1);
                    right_vec = new Vector3(0, 1, 0);
                    let q = this.camera.orientation.conjugate();
                    let c = q.conjugate();
                    let up = q.multiply(Quaternion.fromVector(up_vec)).multiply(c);
                    let forward = q.multiply(Quaternion.fromVector(right_vec)).multiply(c);

                    let scalar = 270; // Could adjust scalar with current radius in sky
                    let r = Quaternion.fromAxisAngle(up.toVector3().cross(forward.toVector3()).normalize(), (event.clientY - prevY) / scalar);
                    // let r = Quaternion.fromAxisAngle(forward.toVector3().cross(up.toVector3()).normalize(), (event.clientY - prevY)/scalar);
                    let s = Quaternion.fromAxisAngle(up_vec, (event.clientX - prevX) / scalar);

                    let u = s.multiply(r).normalize();

                    this.camera.position.apply(u);
                    this.camera.orientation = this.camera.orientation.multiply(u.inverse()).normalize();
                }

            }

            prevX = event.clientX;
            prevY = event.clientY;

            // console.log(this.camera.position.toFormattedString())
            // console.log(this.camera.orientation.toFormattedString())
        };

        // Mouse up handler
        const handleMouseUp = () => {
            isDragging = false;
            this.viewPort.plot.releaseBoundingRect();
            this.viewPort.plot.releaseCTM();
        };

        let scaleFactor = 1.1;

        // Keydown handler
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.camera.lookAt(this.origin, new Vector3(0, 0, -1));
                    break;
                case 'ArrowDown':
                    // Handle arrow down key
                    this.camera.lookAt(this.origin, new Vector3(0, 0, 1));
                    break;
                case 'ArrowLeft':
                    // Handle arrow left key
                    break;
                case 'ArrowRight':
                    // Handle arrow right key
                    break;
                case 'Enter':
                    // console.log(`cameraOrientation: ${this.camera.orientation.toConstructor((n) => n.toFixed(3))}, \n        cameraPosition: ${this.camera.position.toConstructor((n) => n.toFixed(3))},`);
                    console.log(`let cameraOrientation = ${this.camera.orientation.toConstructor((n) => n.toFixed(3))}; \n        let cameraPosition = ${this.camera.position.toConstructor((n) => n.toFixed(3))};`);
                    break;
                case '=':
                    this.camera.position.set(this.camera.position.scale(1 / scaleFactor));
                    // this.camera.position = this.camera.position.subtract(this.camera.position.normalize().copy());
                    this.camera.updateDependents();
                    break;
                case '-':
                    this.camera.position.set(this.camera.position.scale(scaleFactor));
                    // this.camera.position = this.camera.position.add(this.camera.position.normalize().copy());
                    this.camera.updateDependents();
                    break;
                case 'x':
                    upAxis = 'x';
                    this.camera.orientation.set(new Quaternion(1, 0, 0, 0).multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2)));
                    this.camera.position.set(new Vector3(0, 0, -this.camera.position.length()))
                    this.camera.orientation.updateDependents();
                    this.camera.position.updateDependents();
                    this.camera.updateDependents();


                    // this.camera.lookAt(this.origin, new Vector3(-1, 0, 0));
                    event.preventDefault();
                    break;
                case 'y':
                    upAxis = 'y';
                    this.camera.orientation.set(new Quaternion(1, 0, 0, 0));
                    this.camera.position.set(new Vector3(0, 0, -this.camera.position.length()))
                    this.camera.orientation.updateDependents();
                    this.camera.position.updateDependents();
                    this.camera.updateDependents();

                    // this.camera.lookAt(this.origin, new Vector3(0, -1, 0));
                    event.preventDefault();
                    break;
                case 'z':
                    upAxis = 'z';
                    // this.camera.orientation.set(new Quaternion(0, 0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
                    this.camera.orientation.set(new Quaternion(0, 0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2).multiply(new Quaternion(0, 0, 0, 1)));
                    this.camera.position.set(new Vector3(0, -this.camera.position.length(), 0));
                    this.camera.orientation.updateDependents();
                    this.camera.position.updateDependents();
                    this.camera.updateDependents();



                    // this.camera.orientation.set(Quaternion.identity());
                    // this.camera.position.set(new Vector(this.camera.position.length()))
                    event.preventDefault();
                    break;
                case ' ':
                    // Handle space bar
                    isSpaceDown = true;
                    event.preventDefault();
                    break;
                default:
                    // Handle other keys if necessary
                    break;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    break;
                case 'ArrowDown':
                    break;
                case 'ArrowLeft':
                    // Handle arrow left key
                    break;
                case 'ArrowRight':
                    // Handle arrow right key
                    break;
                case 'Enter':
                    break;
                case ' ':
                    // Handle space bar
                    isSpaceDown = false;
                    // switch (upAxis) {
                    //     case 'x':
                    //         upAxis = 'x';
                    //         this.camera.lookAt(this.origin, new Vector3(-1, 0, 0));
                    //         break;
                    //     case 'y':
                    //         upAxis = 'y';
                    //         this.camera.lookAt(this.origin, new Vector3(0, -1, 0));
                    //         break;
                    //     case 'z':
                    //         upAxis = 'z';
                    //         this.camera.lookAt(this.origin, new Vector3(0, 0, -1));
                    //         break;
                    // }
                    // event.preventDefault();
                    break;
                default:
                    // Handle other keys if necessary
                    break;
            }
        };

        // Attach event listeners
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

    }


    drawOuterSphere(r: number = 10, opacity: number = 0.125, background = true): void {

        let s = 72;
        // let verticalN = 4;
        // let horizontalN = 2;
        let verticalN = 24;
        let horizontalN = 12;
        let identity = Quaternion.identity();

        let longs = this.generateVerticalSlices(s, verticalN, identity);

        for (let i = 0; i < longs.length; i++) {
            let path = this.viewPort.frame.path();
            path.setAttribute('stroke', 'var(--medium)');
            path.setAttribute('stroke-width', '1.5px');
            path.setAttribute('stroke-opacity', `${opacity}`)
            path.addDependency(this.camera, this.q);
            path.update = () => {

                let lastVisible = false;
                let d = '';
                for (let j = 0; j < longs[i].length; j++) {

                    let point = longs[i][j].copy();
                    let t = point.apply(this.q).scale(r);

                    let v = this.camera.projectPoint(t);
                    let u = this.viewPort.plot.SVGToRelative(v);

                    if (v.z === 1) {

                        if (lastVisible) {
                            d += `L ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                        } else {
                            d += `M ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                            lastVisible = true;
                        }
                    } else {
                        lastVisible = false;
                    }
                }

                path.d = d;
            }
            path.update();
            this.background.appendChild(path)
        }

        let lats = Scene3D.generateHorizontalSlices(horizontalN, s, identity);


        for (let i = 0; i < lats.length; i++) {
            let path = this.viewPort.frame.path();
            path.setAttribute('stroke', 'var(--medium)')
            path.setAttribute('stroke-width', '1.5px')
            path.setAttribute('stroke-opacity', `${opacity}`)
            path.addDependency(this.camera, this.q);

            path.update = () => {

                let d = '';
                let lastVisible = false;

                for (let j = 0; j < lats[i].length; j++) {

                    let point = lats[i][j].copy();
                    let t = point.apply(this.q).scale(r);

                    let v = this.camera.projectPoint(t);
                    let u = this.viewPort.plot.SVGToRelative(v);

                    if (v.z === 1) {

                        if (lastVisible) {
                            d += `L ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                        } else {
                            d += `M ${u.x.toFixed(3)} ${u.y.toFixed(3)} `;
                            lastVisible = true;
                        }
                    } else {
                        lastVisible = false;
                    }
                }

                path.d = d;
            }

            path.update();
            this.background.appendChild(path)

        }

    }

    generateVerticalSlices(lats: number, longs: number, r: Quaternion = Quaternion.identity()): Vector3[][] {

        let points: Vector3[][] = [];

        
        for (let longIndex = 0; longIndex < longs; longIndex++) {

            let slice: Vector3[] = [];

            let long = (2 * Math.PI * longIndex / longs);

            let start = 0;
            if (longIndex % 6 !== 0) {
                start = 6;
            }

            for (let latIndex = start; latIndex <= lats; latIndex++) {

                let lat = (Math.PI / 2) - (Math.PI * latIndex / lats);

                let p = Scene3D.convertSphericalToCartesian(lat, long);

                slice.push(p.apply(r));

            }

            points.push(slice);
        }

        return points;
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