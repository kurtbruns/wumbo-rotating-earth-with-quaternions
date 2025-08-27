import { Quaternion, Scene3D, Vector2, Vector3 } from "../vector/src";
import { EarthScene } from "./EarthScene";


export class EarthOrientation extends EarthScene {
    constructor() {


        // Set the camera's orientation with this method
        const cameraLatitudeLongitudeView = (lat: number, long: number): Quaternion => {

            let q = Quaternion.identity();

            q = q.multiply(Quaternion.fromAxisAngle(new Vector3(1, 0, 0), -lat * Math.PI / 180 + Math.PI/2));
            q = q.multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), -long * Math.PI / 180 - Math.PI/2));

            return q;
        }

        // Set q with this method
        const latitudeLongitudeView = (lat: number, long: number): Quaternion => {

            let q = Quaternion.identity();

            q = q.multiply(Quaternion.fromAxisAngle(new Vector3(1, 0, 0), lat * Math.PI / 180 - Math.PI / 2));
            q = q.multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), - long * Math.PI / 180 - Math.PI / 2));

            return q;
        }

        let qValues = {
            'Zero': latitudeLongitudeView(0, 0),
            'Salt Lake': latitudeLongitudeView(40.7608, -111.8910),
            'Japan': latitudeLongitudeView(36.2048, 138.2529),
            'Australia': latitudeLongitudeView(-25.2744, 133.7751),
            'San Francisco': latitudeLongitudeView(37.7749, -122.4194),
            'Tokyo': latitudeLongitudeView(35.6895, 139.6917),
            'Bangkok': latitudeLongitudeView(13.7563, 100.5018),
            'New York': latitudeLongitudeView(40.7128, -74.0060),
            'London': latitudeLongitudeView(51.5074, -0.1278),
            'Paris': latitudeLongitudeView(48.8566, 2.3522),
            'Moscow': latitudeLongitudeView(55.7558, 37.6173),
            'Beijing': latitudeLongitudeView(39.9042, 116.4074),
            'Delhi': latitudeLongitudeView(28.6139, 77.2090),
            'São Paulo': latitudeLongitudeView(-23.5505, -46.6333),
            'Johannesburg': latitudeLongitudeView(-26.2041, 28.0473),
            'Mexico City': latitudeLongitudeView(19.4326, -99.1332),
            'Cairo': latitudeLongitudeView(30.0444, 31.2357),
            'Sydney': latitudeLongitudeView(-33.8688, 151.2093),
            'Berlin': latitudeLongitudeView(52.5200, 13.4050),
            'Rome': latitudeLongitudeView(41.9028, 12.4964),
            'Istanbul': latitudeLongitudeView(41.0082, 28.9784),
            'Toronto': latitudeLongitudeView(43.651070, -79.347015),
            'Dubai': latitudeLongitudeView(25.276987, 55.296249),
            'Buenos Aires': latitudeLongitudeView(-34.6037, -58.3816),
            'Seoul': latitudeLongitudeView(37.5665, 126.9780),
            'Los Angeles': latitudeLongitudeView(34.0522, -118.2437),
            'Mumbai': latitudeLongitudeView(19.0760, 72.8777),
            'Singapore': latitudeLongitudeView(1.3521, 103.8198),
            'Hong Kong': latitudeLongitudeView(22.3193, 114.1694),
            'Jakarta': latitudeLongitudeView(-6.2088, 106.8456),
            'Rio de Janeiro': latitudeLongitudeView(-22.9068, -43.1729),
            'Chicago': latitudeLongitudeView(41.8781, -87.6298),
            'Tehran': latitudeLongitudeView(35.6892, 51.3890),
            'Baghdad': latitudeLongitudeView(33.3152, 44.3661),
            'Karachi': latitudeLongitudeView(24.8607, 67.0011),
            'Lagos': latitudeLongitudeView(6.5244, 3.3792),
            'Madrid': latitudeLongitudeView(40.4168, -3.7038),
            'Kuala Lumpur': latitudeLongitudeView(3.1390, 101.6869),
            'Santiago': latitudeLongitudeView(-33.4489, -70.6693),
            'Lima': latitudeLongitudeView(-12.0464, -77.0428),
            'Athens': latitudeLongitudeView(37.9838, 23.7275),
        };

        let views = {
            'Zero': cameraLatitudeLongitudeView(0, 0),
            'Salt Lake': cameraLatitudeLongitudeView(40.7608, -111.8910),
            'Japan': cameraLatitudeLongitudeView(36.2048, 138.2529),
            'Australia': cameraLatitudeLongitudeView(-25.2744, 133.7751),
            'San Francisco': cameraLatitudeLongitudeView(37.7749, -122.4194),
            'Tokyo': cameraLatitudeLongitudeView(35.6895, 139.6917),
            'Bangkok': cameraLatitudeLongitudeView(13.7563, 100.5018),
            'New York': cameraLatitudeLongitudeView(40.7128, -74.0060),
            'London': cameraLatitudeLongitudeView(51.5074, -0.1278),
            'Paris': cameraLatitudeLongitudeView(48.8566, 2.3522),
            'Moscow': cameraLatitudeLongitudeView(55.7558, 37.6173),
            'Beijing': cameraLatitudeLongitudeView(39.9042, 116.4074),
            'Delhi': cameraLatitudeLongitudeView(28.6139, 77.2090),
            'São Paulo': cameraLatitudeLongitudeView(-23.5505, -46.6333),
            'Johannesburg': cameraLatitudeLongitudeView(-26.2041, 28.0473),
            'Mexico City': cameraLatitudeLongitudeView(19.4326, -99.1332),
            'Cairo': cameraLatitudeLongitudeView(30.0444, 31.2357),
            'Sydney': cameraLatitudeLongitudeView(-33.8688, 151.2093),
            'Berlin': cameraLatitudeLongitudeView(52.5200, 13.4050),
            'Rome': cameraLatitudeLongitudeView(41.9028, 12.4964),
            'Istanbul': cameraLatitudeLongitudeView(41.0082, 28.9784),
            'Toronto': cameraLatitudeLongitudeView(43.651070, -79.347015),
            'Dubai': cameraLatitudeLongitudeView(25.276987, 55.296249),
            'Buenos Aires': cameraLatitudeLongitudeView(-34.6037, -58.3816),
            'Seoul': cameraLatitudeLongitudeView(37.5665, 126.9780),
            'Los Angeles': cameraLatitudeLongitudeView(34.0522, -118.2437),
            'Mumbai': cameraLatitudeLongitudeView(19.0760, 72.8777),
            'Singapore': cameraLatitudeLongitudeView(1.3521, 103.8198),
            'Hong Kong': cameraLatitudeLongitudeView(22.3193, 114.1694),
            'Jakarta': cameraLatitudeLongitudeView(-6.2088, 106.8456),
            'Rio de Janeiro': cameraLatitudeLongitudeView(-22.9068, -43.1729),
            'Chicago': cameraLatitudeLongitudeView(41.8781, -87.6298),
            'Tehran': cameraLatitudeLongitudeView(35.6892, 51.3890),
            'Baghdad': cameraLatitudeLongitudeView(33.3152, 44.3661),
            'Karachi': cameraLatitudeLongitudeView(24.8607, 67.0011),
            'Lagos': cameraLatitudeLongitudeView(6.5244, 3.3792),
            'Madrid': cameraLatitudeLongitudeView(40.4168, -3.7038),
            'Kuala Lumpur': cameraLatitudeLongitudeView(3.1390, 101.6869),
            'Santiago': cameraLatitudeLongitudeView(-33.4489, -70.6693),
            'Lima': cameraLatitudeLongitudeView(-12.0464, -77.0428),
            'Athens': cameraLatitudeLongitudeView(37.9838, 23.7275),
        };

        super({
            // drawAxes: true,
            // q:  views['Salt Lake'],
        });



        // this.drawCirclesOnSphere(1, Math.PI/36);

        let normalToCamera = new Vector3();
        normalToCamera.addDependency(this.camera.orientation);
        normalToCamera.update = () => {
            let v = this.camera.orientation.conjugate().transform(new Vector3(0, 0, -1));
            normalToCamera.set(new Vector3(v.x, v.y, -v.z));
        }
        normalToCamera.update();


        let base = new Vector3();
        base.addDependency(normalToCamera);
        base.update = () => {
            base.set(normalToCamera.scale(1.5));
        }

        // this.vector(normalToCamera, base)


        let topView = this.camera.orientation.inverse().multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI));

        let frontView = this.camera.orientation.inverse()

        frontView = frontView.multiply(Quaternion.fromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2));

        let rightView = this.camera.orientation.inverse()

        rightView = rightView.multiply(Quaternion.fromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2));
        rightView = rightView.multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2));


        let rotateFrontView1 = frontView.multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI))
        let rotateFrontView2 = rotateFrontView1.multiply(Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI))

        this.rotateCamera = false;

        this.reset = () => {
            normalToCamera.update = () => {};
            this.rotateCamera = true;
        }

        this.wait();


        // this.onDone = () => {
        //     normalToCamera.update = () => {};
        // }

        // this.play([
        //     this.camera.animate.slerp(views['San Francisco'])
        // ], 3);

        // this.play([
        //     this.camera.animate.rotate(views['San Francisco'].conjugate().transform(new Vector3(0, 0, -1)), Math.PI/3)
        // ], 3)

        // this.wait();

        // this.play([
        //     this.q.animate.rotate(new Vector3(0, 0, 1), Math.PI)
        // ], 2, "easeIn")

        // this.play([
        //     this.q.animate.rotate(new Vector3(0, 0, 1), Math.PI)
        // ], 2, "easeOut")


        



    }


}