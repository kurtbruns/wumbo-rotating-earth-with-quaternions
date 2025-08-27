import { interpolateColor, Quaternion, Scene3D, Value, Vector3 } from "../../vector/src";
import { PropCamera } from "../PropCamera";
import { QScene } from "../QScene";

export class ThirdPersonPerspectiveToBirdsEye extends QScene {

    propCamera: PropCamera;

    constructor() {

        // Third person
        let cameraOrientation = new Quaternion(0.94744, -0.18713, -0.25458, 0.05028).normalize(); 
        let cameraPosition = new Vector3(-5.51661, 4.52426, -9.52407);

        // cameraOrientation = new Quaternion(1, 0, 0, 0);
        // cameraPosition = new Vector3(0, 0, -14);

        super({
            drawSphere: false,
            showQuaternionTex: false,
            drawBasisVectors: true,
            size: 1.8,

            cameraOrientation: cameraOrientation,
            cameraPosition: cameraPosition,

        });

        this.normal = new Vector3();
        this.normal.addDependency(this.camera.orientation);
        this.normal.update = () => {
            let v = this.camera.orientation.conjugate().transform(new Vector3(0, 0, -1));
            this.normal.set(new Vector3(v.x, v.y, -v.z));
        }
        this.normal.update();

        // this.vector(this.origin, this.normal)

        let s = 1;

        // this.drawCirclesOnSphere();
        this.drawSphere(new Value(1), 0.2, true, 'var(--background-lighter)');

        this.foreground.appendChild(this.zAxis);
        this.foreground.appendChild(this.xAxisLabel);
        this.foreground.appendChild(this.yAxisLabel);
        this.foreground.appendChild(this.zAxisLabel);

        // this.drawIJKOutOfSphere();
        // this.drawCirclesOnSphere();

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
        this.play([
            // this.camera.animate.slerp(Quaternion.identity()),
            this.camera.animate.change(Quaternion.identity(), 9),
            cameraPath.animate.setOpacity(0),
            ...frustrum.map(item =>
                item.animate.setOpacity(0)
            ),
            this.zAxis.animate.setOpacity(0),
            this.zAxisLabel.animate.setOpacity(0),

        ], 3);


        // this.wait(0.5)

        this.play([
            this.camera.animate.change(Quaternion.identity(), 5.5),
        ], 2)

        this.play([
            base.animate.setOpacity(0)
        ])

        this.wait(2);

    }




}