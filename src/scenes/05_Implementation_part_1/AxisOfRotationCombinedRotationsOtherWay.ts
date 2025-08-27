import { Line, Quaternion, Vector3 } from '@kurtbruns/vector';
import { SphereScene } from "../SphereScene";

export class AxisOfRotationCombinedRotationsOtherWay extends SphereScene {

  constructor() {
    super({
      cameraPosition: new Vector3(0,0,-6)
    });

    let q0 = Quaternion.identity();
    (window as any).save = () => {
      q0.set(this.q);
    }

    let r1 = Quaternion.fromAxisAngle(new Vector3(1, 1, 1), -2 * Math.PI / 3);
    let r2 = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), 2 * Math.PI / 4);


    let label = this.viewPort.frame.tex('', 120, 270);
    label.addDependency(this.q);
    label.update = () => {
      let ti = this.q.transform(new Vector3(1, 0, 0));
      let tj = this.q.transform(new Vector3(0, 1, 0));
      let tk = this.q.transform(new Vector3(0, 0, 1));
      // Define a small epsilon value for floating-point comparison
      const EPSILON = 1e-10;

      // Helper function to format numbers with fixed decimal places and avoid negative zero
      function formatNumber(value) {
        if (Math.abs(value) < EPSILON) {
          // Treat the value as zero if it's within the epsilon range
          return '\\phantom{-} 0.00';
        }
        return (value >= 0 ? '\\phantom{-}' : '') + value.toFixed(2);
      }

      label.replace(`
    \\begin{aligned}
    f(\\hat{\\imath}) &= 
    \\left[
      \\begin{array}{c} 
        \\: ${formatNumber(ti.x)} \\: \\\\ 
        \\: ${formatNumber(ti.y)} \\: \\\\ 
        \\: ${formatNumber(ti.z)} \\: 
      \\end{array}
    \\right] \\\\[1em]
    f(\\hat{\\jmath}) &= 
    \\left[
      \\begin{array}{c} 
        \\: ${formatNumber(tj.x)} \\: \\\\ 
        \\: ${formatNumber(tj.y)} \\: \\\\ 
        \\: ${formatNumber(tj.z)} \\: 
      \\end{array}
    \\right] \\\\[1em]
    f(\\hat{k}) &= 
    \\left[
      \\begin{array}{c} 
        \\: ${formatNumber(tk.x)} \\: \\\\ 
        \\: ${formatNumber(tk.y)} \\: \\\\ 
        \\: ${formatNumber(tk.z)} \\: 
      \\end{array}
    \\right]
    \\end{aligned}
`)
      label.setColor('\\hat{\\imath}', 'var(--green)')
      label.setColor('\\hat{\\jmath}', 'var(--red)')
      label.setColor('\\hat{k}', 'var(--blue)')
      label.alignCenter();
    }
    label.update();
    label.setColor('\\hat{\\imath}', 'var(--green)')
    label.setColor('\\hat{\\jmath}', 'var(--red)')
    label.setColor('\\hat{k}', 'var(--blue)')



    this.reset = () => {

      let q1 = this.q.copy();

      this.clear()

      this.play([
        this.q.animate.rotateBy(r1, false)
      ], 3)

      this.wait();

      this.play([
        this.q.animate.rotateBy(r2, false)
      ], 3)

    }

  }

  dissappearingTex(v: Vector3, t: string, s = 1.75) {

    let tex = this.tex(v, t, undefined, false);
    // tex.setBackgroundOpacity(0.5)

    let copy = v.copy();
    v.addDependency(this.q);
    v.update = () => {
      v.set(this.q.transform(copy).scale(s))

      let epsilon = 0.8;
      let dot = this.normal.dot(v);
      if (dot < -epsilon) {
        tex.setAttribute('opacity', '0');
      } else {
        tex.setAttribute('opacity', Math.abs(dot + epsilon).toFixed(2));
      }

    }
    v.update()
    tex.update()


    return tex;


  }









}