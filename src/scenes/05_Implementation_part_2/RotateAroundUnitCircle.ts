import { interpolateColor, Plot, Point, ScenePlayer, Value } from '@kurtbruns/vector';

export class RotateAroundUnitCircle extends ScenePlayer {
    plot: Plot;

    constructor() {

        let aspectRatio = 16/9;
        let width = 7.2;
        let height = width / aspectRatio;

        super({
            width: 960,
            height: 540,
        });

        this.plot = new Plot(this.frame, {
            width: 960,
            height: 540,
            viewportX: -width/2,
            viewportY: -height/2,
            viewportWidth: width,
            viewportHeight: height,
            // labelAxes: false,
            // margin: 0,
            // drawGrid: true,
        })  

        // this.plot.drawGrid([
        //     this.plot.generateHorizontalValues('small'),
        //     this.plot.generateHorizontalValues('half'),
        //     this.plot.generateHorizontalValues('big'),
        // ],[
        //     this.plot.generateVerticalValues('small'),
        //     this.plot.generateVerticalValues('half'),
        //     this.plot.generateVerticalValues('big'),
        // ]);


        let scale = 1.25
        let xAxisPos = this.plot.displayArrow(new Point(0,0), new Point(scale,0), interpolateColor('var(--font-color)', 'var(--background)'));
        let xAxisNeg = this.plot.displayArrow(new Point(0,0), new Point(-scale,0), interpolateColor('var(--font-color)', 'var(--background)'));
        let yAxisPos = this.plot.displayArrow(new Point(0,0), new Point(0,scale), interpolateColor('var(--font-color)', 'var(--background)'));
        let yAxisNeg = this.plot.displayArrow(new Point(0,0), new Point(0,-scale), interpolateColor('var(--font-color)', 'var(--background)'));


        let circlePath = this.plot.drawParametric({
            x: (t) => Math.cos(t),
            y: (t) => Math.sin(t),
        })
        circlePath.setAttribute('opacity', '0.5');

        let theta = new Value(0);
        let point = new Point(1,0);
        point.addDependency(theta);
        point.update = () => {
            point.set(new Point(Math.cos(theta.value), Math.sin(theta.value)));
        }
        this.plot.displayVector(point, 'var(--font-color)');

        let horizontal = new Point(point.x, 0);
        horizontal.addDependency(theta);
        horizontal.update = () => {
            horizontal.set(new Point(point.x, 0));
        }
        this.plot.displayVector(horizontal, 'var(--yellow)');

        // let vertical = new Point(0, point.y);
        // vertical.addDependency(theta);
        // vertical.update = () => {
        //     vertical.set(new Point(point.x, point.y));
        // }

        let verticalVector = this.plot.displayLine(horizontal, point, interpolateColor('var(--font-color)', 'var(--background)'));
        verticalVector.setAttribute('stroke-dasharray', '8, 8');
        verticalVector.setAttribute('stroke-width', '1.5');

        this.wait();

        this.play([
            theta.animate.setValue(2*Math.PI),
        ], 10)

        this.wait();

        this.play([
            theta.animate.setValue(0),
        ], 10)

        this.wait();


        // // this.plot.drawGridLines()
        // this.plot.drawAxes(true)
        // this.plot.drawParametric({
        //     x: (t) => Math.cos(t),
        //     y: (t) => Math.sin(t),
        // })

        // let theta = new Value(0);
        // let point = new Point(0,0);
        
        // this.plot.gridPoint(this.plot, new Point())

        // this.plot.circle(0,0,100)
        
    }
}