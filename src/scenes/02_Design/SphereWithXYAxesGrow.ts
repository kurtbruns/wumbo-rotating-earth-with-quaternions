import { Group, Quaternion, Value, Vector3 } from '@kurtbruns/vector';
import { SphereScene } from "../SphereScene";

export class SphereWithXYAxesGrow extends SphereScene {

    axisSize: Value;
    xAxisVector: Vector3;
    yAxisVector: Vector3;
    zAxisVector: Vector3;

    constructor() {

        let size = 1.8;
        super({
            drawAxes: false,
            drawIJK: true,
            drawSphereCircles: true,
            cameraPosition: new Vector3(0, 0, -5.5),
            size: size
        });

        // this.drawIJKOutOfSphere(0.75, 1);
        // this.drawCirclesOnSphereAlt(1, Math.PI / 12, 0.75);

        this.axisSize = new Value(size);
        this.drawAxes(size, { ...{ color: 'var(--font-color-light)', arrows: true }});
        // this.labelAxes(size);
        // this.zAxisLabel.setAttribute('opacity', '0');
        // let xLabel = this.xAxisLabel;
        // let yLabel = this.yAxisLabel;
        // xLabel.update = () => {}
        // yLabel.update = () => {}


        this.reset = () => {
            // this.q.set(new Quaternion(0.95, 0.15, -0.22, -0.17).normalize());


            this.displayTex.setAttribute('opacity', '0');
            this.basisVectors.setAttribute('opacity', '0');
            this.sphereCircles.setAttribute('opacity', '0');
            // this.zAxis.setOpacity(1);
            // this.zAxisLabel.setAttribute('opacity', '1');
        }
        this.reset();

        let scale = 1;

        let buffer = 0.6;
        let bufferVector = new Vector3(1, 0, 0).scale(buffer);
        let xAxis = new Vector3(1, 0, 0);
        let yAxis = new Vector3(0, 1, 0);
        xAxis.addDependency(this.axisSize);
        yAxis.addDependency(this.axisSize);

        xAxis.update = () => {
            this.viewPort.plot.SVGToRelative(0.5, 0);
            xAxis.set(new Vector3(1, 0, 0).scale(this.axisSize.value - buffer*this.camera.position.length()/8.5));
        }
        xAxis.update();
        yAxis.update = () => {
            yAxis.set(new Vector3(0, 1, 0).scale(this.axisSize.value - buffer*this.camera.position.length()/8.5));
        }
        yAxis.update();

        
        let ihat = new Vector3(1, 0, 0).scale(scale);
        let jhat = new Vector3(0, 1, 0).scale(scale);
        let khat = new Vector3(0, 0, 1).scale(scale);
        this.orientPoint(ihat, this.q);
        this.orientPoint(jhat, this.q);
        this.orientPoint(khat, this.q);
        let basisVectorsOld = this.viewPort.frame.group();
        basisVectorsOld.appendChild(this.vector(this.origin, ihat, 'var(--red)'));
        basisVectorsOld.appendChild(this.vector(this.origin, jhat, 'var(--green)'));
        basisVectorsOld.appendChild(this.vector(this.origin, khat, 'var(--blue)'));

        let si = this.orientPoint(new Vector3(1, 0, 0), this.q);
        let sj = this.orientPoint(new Vector3(0, 1, 0), this.q);
        let sk = this.orientPoint(new Vector3(0, 0, 1), this.q);

      
        let basisVectorLabels = this.viewPort.frame.group();
        let iLabelSphere = this.sphereLabel(si, '\\hat{\\imath}').setColor('\\hat{\\imath}','var(--red)');
        let jLabelSphere = this.sphereLabel(sj, '\\hat{\\jmath}').setColor('\\hat{\\jmath}','var(--green)');
        let kLabelSphere = this.sphereLabel(sk, '\\hat{k}').setColor('\\hat{k}','var(--blue)');

        iLabelSphere.setAttribute('font-size', '20px')
        jLabelSphere.setAttribute('font-size', '20px')
        kLabelSphere.setAttribute('font-size', '20px')

        basisVectorLabels.appendChild(iLabelSphere);
        basisVectorLabels.appendChild(jLabelSphere);
        basisVectorLabels.appendChild(kLabelSphere);


        this.sphereRadius.value = scale;
        this.sphereRadius.updateDependents();

        this.q.set(new Quaternion(0.94, 0.17, -0.23, -0.17).normalize());

        // this.play([
        //     this.q.animate.slerp(new Quaternion(0.94, 0.17, -0.23, -0.17).normalize()),
        // ], 2)


        this.play([
            ihat.animate.moveTo(ihat.normalize().scale(1.5)),
            jhat.animate.moveTo(jhat.normalize().scale(1.5)),
            khat.animate.moveTo(khat.normalize().scale(1.5)),
            si.animate.moveTo(si.normalize().scale(1.25)),
            sj.animate.moveTo(sj.normalize().scale(1.25)),
            sk.animate.moveTo(sk.normalize().scale(1.25)),
            // this.camera.animate.change(Quaternion.identity(), 5.5),
            // this.sphereRadius.animate.setValue(1),
            
        ], 3)

        this.wait(1)

        // this.play([
        //     this.sphereRadius.animate.setValue(1),
        // ], 2)

        
        this.play([
            this.basisVectors.animate.setOpacity(1),
            this.sphereCircles.animate.setOpacity(1),
            basisVectorsOld.animate.setOpacity(0),
        ], 2)
        
        this.wait(2)

        

        // this.play([
        //     this.axes.animate.setOpacity(0),
        // ])

        // this.play([
        //     this.displayTex.animate.setOpacity(1),
        // ], 3)

    }

    drawAxes(d: number = 5, options: { color?: string, arrows?: boolean, opacity?: number, sizeX?: number, sizeY?: number, sizeZ?: number } = {}) {

        let defaultOptions = {
            color: 'var(--font-color-light)',
            arrows: true,
            opacity: 1,
            sizeX: d,
            sizeY: d,
            sizeZ: d,
        };

        options = { ...defaultOptions, ...options };

        let x = this.axisSize.value;
        let y = this.axisSize.value;
        let z = this.axisSize.value;

        let xAxis1 = new Vector3(x, 0, 0);
        let xAxis2 = new Vector3(-x, 0, 0);
        let yAxis1 = new Vector3(0, y, 0);
        let yAxis2 = new Vector3(0, -y, 0);
        let zAxis1 = new Vector3(0, 0, z);
        let zAxis2 = new Vector3(0, 0, -z);

        this.xAxisVector = xAxis1;
        this.yAxisVector = yAxis1;
        this.zAxisVector = zAxis1;

        let vectors = [xAxis1, xAxis2, yAxis1, yAxis2, zAxis1, zAxis2];

        for(let vector of vectors) {
            let normalized = vector.copy().normalize();
            vector.addDependency(this.axisSize);
            vector.update = () => {
                vector.set(normalized.scale(this.axisSize.value));
            }
        }

        this.xAxis = this.drawAxesHelper(xAxis1, xAxis2, options);
        this.yAxis = this.drawAxesHelper(yAxis1, yAxis2, options);
        
    }







}