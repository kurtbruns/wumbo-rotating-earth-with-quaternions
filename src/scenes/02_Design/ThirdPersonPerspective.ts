import { interpolateColor, Quaternion, Scene3D, Value, Vector3 } from "../../vector/src";
import { PropCamera } from "../PropCamera";
import { QScene } from "../QScene";

export class ThirdPersonPerspective extends QScene {

    propCamera: PropCamera;

    constructor() {

        // Third person
        let cameraOrientation = new Quaternion(0.94744, -0.18713, -0.25458, 0.05028); 
        let cameraPosition = new Vector3(-6.49007, 5.32263, -11.20484).scale(0.85);

        // cameraOrientation = new Quaternion(1, 0, 0, 0);
        // cameraPosition = new Vector3(0, 0, -14);

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

        // this.vector(this.origin, this.normal)

        // this.drawIJKOutOfSphere();

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
        let base = this.drawPathNoQ(basePoints, { opacity: 0.25 });

        let frustrum = this.background.group();
        
        // Draw the triangular faces connecting each edge of the rectangle to the apex
        for (let i = 0; i < basePoints.length; i++) {
            let nextIndex = (i + 1) % basePoints.length;
            let trianglePath = [basePoints[i], basePoints[nextIndex], apex];
            let p = this.drawPathNoQ(trianglePath, { opacity: 0.25 })
            frustrum.appendChild(p)
        }

        this.reset = () => {
            // this.q.set(new Quaternion(0.95, 0.02, -0.31, -0.12));

            // this.q.set(new Quaternion(0.93, 0.20, -0.29, 0.13))
            this.camera.orientation.set(Quaternion.identity())
            this.camera.position.set(new Vector3(0, 0, -6))
            this.camera.updateDependents();

            base.setOpacity(0);

            cameraPath.setOpacity(0);
            frustrum.setAttribute('opacity', '0');
            this.zAxis.setOpacity(0);
            this.zAxisLabel.setAttribute('opacity', '0')
        }
        this.reset();

        this.wait();


        function delayAnimation(fn: (t: number) => void): (t: number) => void {
            return (t: number) => {
                if (t < 0.5) {
                    // Delay the animation by returning 0 for inputs < 0.5
                    return 0;
                } else {
                    // Remap the input range [0.5, 1] to [0, 1]
                    const adjustedT = (t - 0.5) * 2;
                    fn(adjustedT);
                }
            };
        }

        function easeIn(fn: (t: number) => void): (t: number) => void {
            return (t: number) => {
                // Apply easeIn directly to t in the [0, 1] range
                fn(t*t);
            };
        }

        this.play([
            this.camera.animate.change(cameraOrientation, cameraPosition.length()),
            easeIn(cameraPath.animate.setOpacity(0.5)),
            base.animate.setOpacity(0.5),
            // delayAnimation(base.animate.setOpacity(0.5)),
            easeIn(frustrum.animate.setOpacity(1)),
            this.zAxis.animate.setOpacity(1),
            this.zAxisLabel.animate.setOpacity(1),

        ], 5);


        this.wait();

        // this.play([
            
        //     this.q.animate.slerp(Quaternion.identity())

        // ], 2);

        // this.play([
        //     this.q.animate.slerp(new Quaternion(0.93, 0.20, -0.29, 0.13))
        // ], 2)

        // this.wait()



    }




}