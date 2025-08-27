import { Path, Quaternion, Scene3D, Vector3 } from '@kurtbruns/vector';


export class PropCamera {

    position: Vector3;
    orientation: Quaternion;

    body: number[][][];
    handle: number[][][];
    lens: number[][][];
    path: Path;

    constructor(position = new Vector3()) {
        // Rectangle body dimensions
        let width = 0.2;
        let height = 0.3;
        let length = 0.5;
    
        this.position = position;
        this.orientation = Quaternion.identity();
    
        // Truncated pyramid (lens) dimensions
        let baseWidth = 0.3;  // Larger base width (attached to the body at -Z)
        let baseHeight = 0.2;  // Larger base height (attached to the body at -Z)
        let topWidth = 0.1;  // Smaller base width (front of the lens)
        let topHeight = 0.1;  // Smaller base height (front of the lens)
        let lensLength = 0.1;  // Length of the truncated pyramid
    
        // Calculate the position of the apex (in the current coordinates)
        let apexLength = (lensLength * baseWidth) / (baseWidth - topWidth);
        // let apexZ = -(length / 2) - apexLength;
        let apexZ = -(length / 2);
    
        // Translate the body, handle, and lens vertices so that the apex is at (0, 0, 0)
    
        this.body = [
            // Front face (aligned along +Z)
            [
                [width / 2, height / 2, length / 2 - apexZ],
                [width / 2, -height / 2, length / 2 - apexZ],
                [-width / 2, -height / 2, length / 2 - apexZ],
                [-width / 2, height / 2, length / 2 - apexZ]
            ],
            // Back face (aligned along -Z)
            [
                [width / 2, height / 2, -length / 2 - apexZ],
                [width / 2, -height / 2, -length / 2 - apexZ],
                [-width / 2, -height / 2, -length / 2 - apexZ],
                [-width / 2, height / 2, -length / 2 - apexZ]
            ],
            // Top face (aligned along +Y)
            [
                [width / 2, height / 2, length / 2 - apexZ],
                [width / 2, height / 2, -length / 2 - apexZ],
                [-width / 2, height / 2, -length / 2 - apexZ],
                [-width / 2, height / 2, length / 2 - apexZ]
            ],
            // Bottom face (aligned along -Y)
            [
                [width / 2, -height / 2, length / 2 - apexZ],
                [width / 2, -height / 2, -length / 2 - apexZ],
                [-width / 2, -height / 2, -length / 2 - apexZ],
                [-width / 2, -height / 2, length / 2 - apexZ]
            ]
        ];
    
        // Handle dimensions (rectangular prism on top of the camera body)
        let handleWidth = 0.1;
        let handleHeight = 0.1;
        let handleLength = 0.3;
    
        this.handle = [
            // Front face (aligned along +Z)
            [
                [handleWidth / 2, height / 2 + handleHeight, handleLength / 2 - apexZ],
                [handleWidth / 2, height / 2, handleLength / 2 - apexZ],
                [-handleWidth / 2, height / 2, handleLength / 2 - apexZ],
                [-handleWidth / 2, height / 2 + handleHeight, handleLength / 2 - apexZ]
            ],
            // Back face (aligned along -Z)
            [
                [handleWidth / 2, height / 2 + handleHeight, -handleLength / 2 - apexZ],
                [handleWidth / 2, height / 2, -handleLength / 2 - apexZ],
                [-handleWidth / 2, height / 2, -handleLength / 2 - apexZ],
                [-handleWidth / 2, height / 2 + handleHeight, -handleLength / 2 - apexZ]
            ],
            // Top face (aligned along +Y)
            [
                [handleWidth / 2, height / 2 + handleHeight, handleLength / 2 - apexZ],
                [handleWidth / 2, height / 2 + handleHeight, -handleLength / 2 - apexZ],
                [-handleWidth / 2, height / 2 + handleHeight, -handleLength / 2 - apexZ],
                [-handleWidth / 2, height / 2 + handleHeight, handleLength / 2 - apexZ]
            ],
            // Bottom face (aligned along -Y)
            [
                [handleWidth / 2, height / 2, handleLength / 2 - apexZ],
                [handleWidth / 2, height / 2, -handleLength / 2 - apexZ],
                [-handleWidth / 2, height / 2, -handleLength / 2 - apexZ],
                [-handleWidth / 2, height / 2, handleLength / 2 - apexZ]
            ]
        ];
    
        this.lens = [
            // Smaller base (front of the lens, facing backward in -Z)
            [
                [topWidth / 2, topHeight / 2, -length / 2 - apexZ],
                [topWidth / 2, -topHeight / 2, -length / 2 - apexZ],
                [-topWidth / 2, -topHeight / 2, -length / 2 - apexZ],
                [-topWidth / 2, topHeight / 2, -length / 2 - apexZ]
            ],
            // Larger base (attached to the body at -Z)
            [
                [baseWidth / 2, baseHeight / 2, -(length / 2) - lensLength - apexZ],
                [baseWidth / 2, -baseHeight / 2, -(length / 2) - lensLength - apexZ],
                [-baseWidth / 2, -baseHeight / 2, -(length / 2) - lensLength - apexZ],
                [-baseWidth / 2, baseHeight / 2, -(length / 2) - lensLength - apexZ]
            ],
            // Side faces connecting smaller and larger bases
            [
                [topWidth / 2, topHeight / 2, -length / 2 - apexZ],
                [baseWidth / 2, baseHeight / 2, -(length / 2) - lensLength - apexZ],
                [baseWidth / 2, -baseHeight / 2, -(length / 2) - lensLength - apexZ],
                [topWidth / 2, -topHeight / 2, -length / 2 - apexZ]
            ],
            [
                [topWidth / 2, -topHeight / 2, -length / 2 - apexZ],
                [baseWidth / 2, -baseHeight / 2, -(length / 2) - lensLength - apexZ],
                [-baseWidth / 2, -baseHeight / 2, -(length / 2) - lensLength - apexZ],
                [-topWidth / 2, -topHeight / 2, -length / 2 - apexZ]
            ],
            [
                [-topWidth / 2, -topHeight / 2, -length / 2 - apexZ],
                [-baseWidth / 2, -baseHeight / 2, -(length / 2) - lensLength - apexZ],
                [-baseWidth / 2, baseHeight / 2, -(length / 2) - lensLength - apexZ],
                [-topWidth / 2, topHeight / 2, -length / 2 - apexZ]
            ],
            [
                [-topWidth / 2, topHeight / 2, -length / 2 - apexZ],
                [-baseWidth / 2, baseHeight / 2, -(length / 2) - lensLength - apexZ],
                [baseWidth / 2, baseHeight / 2, -(length / 2) - lensLength - apexZ],
                [topWidth / 2, topHeight / 2, -length / 2 - apexZ]
            ]
        ];
    }

    drawCamera(scene: Scene3D, config = {}) {

        let defaultConfig = { 'stroke': 'var(--main)', 'stroke-width': '1.5px', 'fill': 'none', 'opacity': '0.5' };

        config = { ...defaultConfig, ...config };

        let p = scene.viewPort.frame.path();
        p.setAttribute('fill', config['fill']);
        p.setAttribute('stroke', config['stroke']);
        p.setAttribute('stroke-width', config['stroke-width']);
        p.setAttribute('opacity', config['opacity']);


        p.addDependency(scene.camera, scene.camera.orientation, scene.camera.position, this.orientation, this.position)
        p.update = () => {

            let d = "";
            for (let i = 0; i < this.body.length; i++) {
                let polygon = this.body[i];
                for (let j = 0; j < polygon.length; j++) {

                    let v = new Vector3(...polygon[j]);
                    let t = this.orientation.transform(v).add(this.position);
                    let u = scene.camera.projectPoint(t);
                    let r = scene.viewPort.plot.SVGToRelative(u.x, u.y);

                    d += `${j === 0 ? "M" : "L"} ${r.x.toFixed(2)} ${r.y.toFixed(2)} `

                }
                d += "Z ";
            }

            for (let i = 0; i < this.handle.length; i++) {
                let polygon = this.handle[i];
                for (let j = 0; j < polygon.length; j++) {

                    let v = new Vector3(...polygon[j]);
                    let t = this.orientation.transform(v).add(this.position);
                    let u = scene.camera.projectPoint(t);
                    let r = scene.viewPort.plot.SVGToRelative(u.x, u.y);

                    d += `${j === 0 ? "M" : "L"} ${r.x.toFixed(2)} ${r.y.toFixed(2)} `

                }
                d += "Z ";
            }

            for (let i = 0; i < this.lens.length; i++) {
                let polygon = this.lens[i];
                for (let j = 0; j < polygon.length; j++) {

                    let v = new Vector3(...polygon[j]);
                    let t = this.orientation.transform(v).add(this.position);
                    let u = scene.camera.projectPoint(t);
                    let r = scene.viewPort.plot.SVGToRelative(u.x, u.y);

                    d += `${j === 0 ? "M" : "L"} ${r.x.toFixed(2)} ${r.y.toFixed(2)} `

                }
                d += "Z ";
            }

            p.d = d;
        }
        p.update();

        return p;

    }


}