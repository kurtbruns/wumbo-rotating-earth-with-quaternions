import { interpolateColor, Quaternion, Scene3D, StringValue, Tex, Value, Vector2, Vector3 } from "../../vector/src";
import { EarthOrientationUtils } from "../EarthOrientationUtils";
import { EarthScene } from "../EarthScene";


export class CoordinatesOfNorthPole extends EarthScene {
    constructor() {

        let s = 1.8;
        super({
            cameraPosition: new Vector3(0, 0, -5.5),
            drawIJK: false,
            drawSphereCircles: false,
            showQuaternionTex: false,
            drawAxes: true,
            drawTriangleMesh: true,
            drawContinentsOutline: true,
            size: s,

        });

        // this.drawAxes(2.75)

        // this.axes.setAttribute('opacity', '0');
        this.background.prependChild(this.axes)


        let ihat = new Vector3(1, 0, 0);
        let jhat = new Vector3(0, 1, 0);
        let khat = new Vector3(0, 0, 1);
        this.orientPoint(ihat, this.q);
        this.orientPoint(jhat, this.q);
        this.orientPoint(khat, this.q);
        this.basisVectors = this.viewPort.frame.group();
        this.basisVectors.appendChild(this.vector(this.origin, ihat, 'var(--red)'));
        this.basisVectors.appendChild(this.vector(this.origin, jhat, 'var(--green)'));
        this.basisVectors.appendChild(this.vector(this.origin, khat, 'var(--blue)'));




        this.onLoad = () => {

            let externalCoordinates = this.vectorCoordinates2(khat, 1.25)
            externalCoordinates.setAttribute('font-size', '18px')
            externalCoordinates.setAttribute('color', 'var(--blue)')
            externalCoordinates.setAttribute('opacity', '0')

            let q = new Quaternion(0.94, 0.17, -0.23, -0.17).normalize()

            this.q.set(q);

            let internalCoordiantes = this.viewPort.frame.tex(`\\left[ \\begin{array}{c} \\: 0 \\: \\\\ 0 \\\\ 1 \\end{array} \\right]`)
            internalCoordiantes.setAttribute('font-size', '18px')
            internalCoordiantes.setAttribute('color', 'var(--blue)')
            internalCoordiantes.setAttribute('opacity', '0')

    
            Tex.moveTo(internalCoordiantes, externalCoordinates)

            // this.basisVectors.setAttribute('opacity', '0');
            this.continentsOutline.setAttribute('opacity', '0');
            this.triangleMeshGroup.setAttribute('opacity', '0');

            this.sphereBackground.setAttribute('fill', 'var(--background-lighter)')
            this.sphereBackground.setAttribute('opacity', '0.75')

            this.wait();

            this.play([
                this.continentsOutline.animate.setOpacity(1)
            ], 2)
            this.wait();

            this.play([
                internalCoordiantes.animate.setOpacity(1)
            ], 1)

            this.wait(7);

            this.play([
                externalCoordinates.animate.setOpacity(1),
                internalCoordiantes.animate.setOpacity(0)
            ], 1)

            this.wait(10);

            this.play([
                this.continentsOutline.animate.setOpacity(0),
                externalCoordinates.animate.setOpacity(0),

            ], 1)
            this.wait();




        }


    }


}