import { interpolateColor, Quaternion, Scene3D, StringValue, Value, Vector2, Vector3 } from "../../vector/src";
import { LEFT_Q_VALUE } from "../07_AnimateEarth/QuaternionValues";
import { EarthOrientationUtils } from "../EarthOrientationUtils";
import { EarthScene } from "../EarthScene";


export class SameEarthOrientation extends EarthScene {

    constructor() {

        const qValue = LEFT_Q_VALUE
        const broombridgeQuaternion = EarthOrientationUtils.quaternionToLocationByName('Broom Bridge');

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


        // HACKY
        let temp = new Value();

        let value = new StringValue();
        value.addDependency(temp);
        value.update = () => {
            this.sphereBackground.setAttribute('fill', interpolateColor(currentColor, 'var(--background-lighter)', temp.value))
        }


        this.onLoad = () => {

            this.q.set(qValue);
            this.basisVectors.setAttribute('opacity', '0');
            this.continentsOutline.setAttribute('opacity', '0');

            this.wait();

            this.play([
                this.camera.animate.moveTo(new Vector3(0, 0, -4)),
                this.q.animate.slerp(broombridgeQuaternion)
            ], 5)

            this.wait();

        }


    }


}