import { interpolateColor, Quaternion, Scene3D, StringValue, Value, Vector2, Vector3 } from "../../vector/src";
import { EarthOrientationUtils } from "../EarthOrientationUtils";
import { EarthScene } from "../EarthScene";


export class DesignConsiderations extends EarthScene {
    constructor() {

        const broombridgeQuaternion = EarthOrientationUtils.quaternionToLocationByName('Broom Bridge');

        let s = 1.8;
        super({
            cameraPosition: new Vector3(0, 0, -4),
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

            this.q.set(broombridgeQuaternion);
            this.basisVectors.setAttribute('opacity', '0');
            this.continentsOutline.setAttribute('opacity', '0');

            // this.play([
            //     // this.q.animate.slerp(new Quaternion(0.94, 0.17, -0.23, -0.17).normalize()),
            //     this.q.animate.slerp(Quaternion.identity())
            // ], 5);

            this.wait();

            this.play([
                this.triangleMeshGroup.animate.setOpacity(0),
                this.continentsOutline.animate.setOpacity(1)
            ], 2)

            this.wait();

            this.play([
                this.camera.animate.moveTo(this.camera.position.normalize().scale(5.5)),
                this.continentsOutline.animate.setOpacity(0),
                temp.animate.setValue(1),
                this.basisVectors.animate.setOpacity(1)
            ], 3.5)
    
            this.play([
                this.camera.animate.moveTo(new Vector3(0, 0, -6)),
                this.q.animate.slerp(Quaternion.identity()),

            ], 5.5)


            this.play([
                this.axes.animate.setOpacity(1)
            ])

            this.wait(5)

        }


    }


}