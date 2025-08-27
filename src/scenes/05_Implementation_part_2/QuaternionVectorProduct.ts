import { Quaternion, Vector3 } from '@kurtbruns/vector';
import { SphereScene } from "../SphereScene";


export class QuaternionVectorProduct extends SphereScene {
  constructor() {
    super();
    let theta = 2* Math.PI / 3 ;
    let axis = new Vector3(1, 1, 1).normalize();
    let r = Quaternion.fromAxisAngle(axis, theta);

    let f2 = this.viewPort.frame.tex('f(p) = q \\cdot p \\cdot q^{-1}').alignCenter();
    f2.setAttribute('font-size', '18px');
    f2.moveTo(this.viewPort.frame.width / 2, this.viewPort.frame.height - 50)

    let arrow = this.drawConeArrowOutOfSphere(axis.scale(1.5), 1, 1.5, 'var(--pink)');


    this.reset = () => {
      this.q.set(Quaternion.identity());
      this.clear();
      this.wait()

      this.play([
        this.q.animate.rotateBy(r),
      ], 5, "linear")
      this.wait()
    }
    this.reset();


    
  }

} 