import { interpolateColor, Quaternion, Scene3D, StringValue, Value, Vector2, Vector3 } from '@kurtbruns/vector';
import { EarthOrientationUtils } from "../EarthOrientationUtils";
import { EarthScene } from "../EarthScene";


export class BasisVectorsColors extends EarthScene {
    constructor() {

        const broombridgeQuaternion = EarthOrientationUtils.quaternionToLocationByName('Broom Bridge');
        const sanFranciscoQuaternion = EarthOrientationUtils.quaternionToLocationByName('San Francisco');
        const saltLakeCityQuaternion = EarthOrientationUtils.quaternionToLocationByName('Salt Lake');


        super({
            cameraPosition: new Vector3(0, 0, -4),
            drawIJK: false,
            drawSphereCircles: false,
            showQuaternionTex: false,
            drawAxes: true,
            drawTriangleMesh: true,
            drawContinentsOutline: true,
            size: 2,

        });

        this.q.set(sanFranciscoQuaternion);

        // this.drawAxes(2.75)

        this.axes.setAttribute('opacity', '0');
        this.background.prependChild(this.axes)

        let currentColor = this.sphereBackground.getAttribute('fill');


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

        let si = this.orientPoint(new Vector3(1, 0, 0).scale(1), this.q);
        let sj = this.orientPoint(new Vector3(0, 1, 0).scale(1), this.q);
        let sk = this.orientPoint(new Vector3(0, 0, 1).scale(1), this.q);

        let scale = 1.25;
        let xLabel = this.sphereLabel(si, 'x', scale, false).setColor('x','var(--red)');
        xLabel.root.setAttribute('font-size', '20px');
        xLabel.setAttribute('opacity', '0');
        
        let yLabel = this.sphereLabel(sj, 'y', scale, false).setColor('y','var(--green)');
        yLabel.root.setAttribute('font-size', '20px');
        yLabel.setAttribute('opacity', '0');

        let zLabel = this.sphereLabel(sk, 'z', scale, false).setColor('z','var(--blue)');
        zLabel.root.setAttribute('font-size', '20px');
        zLabel.setAttribute('opacity', '0');


        // HACKY
        let temp = new Value();

        let value = new StringValue();
        value.addDependency(temp);
        value.update = () => {
            this.sphereBackground.setAttribute('fill', interpolateColor(currentColor, 'var(--background-lighter)', temp.value))
        }


        this.onLoad = () => {

            // this.q.set(new Quaternion(0.94, 0.17, -0.23, -0.17).normalize());
            this.basisVectors.setAttribute('opacity', '0');
            this.continentsOutline.setAttribute('opacity', '0');


            this.play([
                this.triangleMeshGroup.animate.setOpacity(0),
                this.continentsOutline.animate.setOpacity(0),
                this.basisVectors.animate.setOpacity(1),
                temp.animate.setValue(1),
                xLabel.animate.setOpacity(1),
                yLabel.animate.setOpacity(1),
                zLabel.animate.setOpacity(1),

            ], 2)

            this.wait(2);

            this.play([
                this.triangleMeshGroup.animate.setOpacity(1),
                this.basisVectors.animate.setOpacity(0),
                temp.animate.setValue(0),
                xLabel.animate.setOpacity(0),
                yLabel.animate.setOpacity(0),
                zLabel.animate.setOpacity(0),

            ], 2)


        }


    }


}