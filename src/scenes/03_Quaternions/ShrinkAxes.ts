import { Group, Quaternion, Tex, Value, Vector3 } from "../../vector/src";
import { SphereScene } from "../SphereScene";

export class ShrinkAxes extends SphereScene {

    axisSize: Value;
    xAxisVector: Vector3;
    yAxisVector: Vector3;
    zAxisVector: Vector3;

    constructor() {

        let size = 1.8;
        super({
            drawAxes: false,
            drawIJK: true,
            drawBasisVectors: false,
            drawSphereCircles: true,
            showQuaternionTex: false,
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


        let scale = 1;

        let buffer = 0.6;
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

        const customSphereLabel = (v: Vector3, s: string) => {
            let t = this.tex(v, s);
            t.setAttribute('font-size', '18px');
            t.addDependency(v, this.normal);
            t.update = () => {
                let p = this.camera.projectPoint(v.normalize().scale(this.axisSize.value + 0.25));
                let q = this.viewPort.plot.SVGToRelative(p);
                t.moveTo(q);
    
            }
            t.update();
        }

        customSphereLabel(xAxis, 'x');
        customSphereLabel(yAxis, 'y');
        
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

        let si = this.orientPoint(new Vector3(1, 0, 0).scale(1.25), this.q);
        let sj = this.orientPoint(new Vector3(0, 1, 0).scale(1.25), this.q);
        let sk = this.orientPoint(new Vector3(0, 0, 1).scale(1.25), this.q);

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

        this.displayTex = this.viewPort.frame.tex('');
        this.displayTex.setAttribute('font-size', '18px');
        this.displayTex.moveTo(this.viewPort.frame.width / 2, 50)
        this.displayTex.addDependency(this.q);
        this.displayTex.update = () => {
            this.displayTex.replace('q=' + this.q.toFormattedString());
            this.displayTex.alignCenter();
        };
        this.displayTex.update();
        this.displayTex.setAttribute('opacity', '0');
        Tex.setOpacityOfTex(this.displayTex.getPartsByTex(this.q.toFormattedString()), 0)

        let startingDisplayTex = this.viewPort.frame.tex('');
        startingDisplayTex.setAttribute('font-size', '18px');
        startingDisplayTex.moveTo(this.viewPort.frame.width / 2, 50)
        startingDisplayTex.addDependency(this.q);
        startingDisplayTex.update = () => {
            startingDisplayTex.replace(this.q.toFormattedString());
            startingDisplayTex.alignCenter();
        };
        startingDisplayTex.update();
        startingDisplayTex.setAttribute('opacity', '0');



        this.reset = () => {
            // this.q.set(new Quaternion(0.95, 0.15, -0.22, -0.17).normalize());

            this.clear();

            basisVectorsOld.setAttribute('opacity', '0');
            // this.basisVectors.setAttribute('opacity', '0');
            // this.sphereCircles.setAttribute('opacity', '0');
            // this.zAxis.setOpacity(1);
            // this.zAxisLabel.setAttribute('opacity', '1');
            

            this.q.set(new Quaternion(0.94, 0.17, -0.23, -0.17).normalize());

            // this.play([
            //     this.q.animate.slerp(new Quaternion(0.94, 0.17, -0.23, -0.17).normalize()),
            // ], 2)


            this.play([
                this.axisSize.animate.setValue(1.5),

            ], 1.5)

            this.wait(1.5)


            this.play([
                startingDisplayTex.animate.setOpacity(1),
            ], 1)

            this.wait(12)

            this.play([
                startingDisplayTex.animate.alignParts(this.displayTex, this.q.toFormattedString())
            ], 1)
            
            this.play([
                this.displayTex.animate.setOpacity(1),
            ], 1)

            this.wait(10)

            this.play([
                this.q.animate.slerp(new Quaternion(0.83, 0.34, -0.44, 0.02).normalize()),
            ], 4)

            this.wait(3)


        }
        this.reset();


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