import { interpolateColor, Quaternion, Scene3D, Value, Vector3 } from "../../vector/src";
import { PropCamera } from "../PropCamera";
import { QScene } from "../QScene";

export class ThirdPersonPerspectiveToRightHanded extends QScene {

    propCamera: PropCamera;

    constructor() {
        // Third person
        let cameraOrientation = new Quaternion(0.94744, -0.18713, -0.25458, 0.05028).normalize(); 
        let cameraPosition = new Vector3(-5.51661, 4.52426, -9.52407);

        let cameraOrientation2 = new Quaternion(0.29059, 0.16832, -0.47085, 0.81580).normalize(); 
        let cameraPosition2 = new Vector3(-3.83804, 4.69278, -3.49960);

        super({
            drawSphere: false,
            showQuaternionTex: false,
            drawBasisVectors: true,
            size: 1.8,
            cameraOrientation: cameraOrientation.copy(),
            cameraPosition: cameraPosition.copy(),
        });

        this.normal = new Vector3();
        this.normal.addDependency(this.camera.orientation);
        this.normal.update = () => {
            let v = this.camera.orientation.conjugate().transform(new Vector3(0, 0, -1));
            this.normal.set(new Vector3(v.x, v.y, -v.z));
        }
        this.normal.update();

        let s = 1;
        let sphere = this.drawSphere(new Value(1), 0.2, true, 'var(--background-lighter)');

        this.foreground.appendChild(this.zAxis);
        this.foreground.appendChild(this.xAxisLabel);
        this.foreground.appendChild(this.yAxisLabel);
        this.foreground.appendChild(this.zAxisLabel);

        let apex = new Vector3(0, 0, 6);

        this.propCamera = new PropCamera(apex);
        let cameraPath = this.propCamera.drawCamera(this);

        let w = 10;
        let aspectRatio = 16 / 9;
        let h = w / aspectRatio;

        let basePoints = [
            new Vector3(w / 2, h / 2, 0),
            new Vector3(w / 2, -h / 2, 0),
            new Vector3(-w / 2, -h / 2, 0),
            new Vector3(-w / 2, h / 2, 0),
        ];

        // Draw the base rectangle
        let base = this.drawPath(basePoints, { opacity: 0.25 });

        let frustrum = [];

        // Draw the triangular faces connecting each edge of the rectangle to the apex
        for (let i = 0; i < basePoints.length; i++) {
            let nextIndex = (i + 1) % basePoints.length;
            let trianglePath = [basePoints[i], basePoints[nextIndex], apex];
            frustrum.push(this.drawPath(trianglePath, { opacity: 0.25 }));
        }

        this.wait();

        // Animate from third-person to right-handed view
        this.play([
            this.camera.animate.change(cameraOrientation2),
            this.camera.animate.moveTo(cameraPosition2),
        ], 5);

        this.wait();

        this.play([
            sphere.animate.setOpacity(0.5)
        ]);

        this.wait(4)
    }
}