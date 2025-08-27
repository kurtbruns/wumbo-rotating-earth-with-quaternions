import { Quaternion, Vector3 } from "../vector/src";

export interface LatLong {
    [key: string]: [number, number];
}

export class EarthOrientationUtils {
    static readonly latLongs: LatLong = {
        'Zero': [0, 0],
        'North Pole': [90, 0],
        'Dublin': [53.3498, -6.2603],
        'Hawaii': [21.3069, -157.8583],
        'Ten Degrees': [10, 10],
        'Broom Bridge': [53.373, -6.300],
        'Salt Lake': [40.7608, -111.8910],
        'Japan': [36.2048, 138.2529],
        'Australia': [-25.2744, 133.7751],
        'San Francisco': [37.7749, -122.4194],
        'Tokyo': [35.6895, 139.6917],
        'Bangkok': [13.7563, 100.5018],
        'New York': [40.7128, -74.0060],
        'London': [51.5074, -0.1278],
        'Paris': [48.8566, 2.3522],
        'Moscow': [55.7558, 37.6173],
        'Beijing': [39.9042, 116.4074],
        'Delhi': [28.6139, 77.2090],
        'São Paulo': [-23.5505, -46.6333],
        'Johannesburg': [-26.2041, 28.0473],
        'Mexico City': [19.4326, -99.1332],
        'Cairo': [30.0444, 31.2357],
        'Sydney': [-33.8688, 151.2093],
        'Berlin': [52.5200, 13.4050],
        'Rome': [41.9028, 12.4964],
        'Istanbul': [41.0082, 28.9784],
        'Toronto': [43.651070, -79.347015],
        'Dubai': [25.276987, 55.296249],
        'Buenos Aires': [-34.6037, -58.3816],
        'Seoul': [37.5665, 126.9780],
        'Los Angeles': [34.0522, -118.2437],
        'Mumbai': [19.0760, 72.8777],
        'Singapore': [1.3521, 103.8198],
        'Hong Kong': [22.3193, 114.1694],
        'Jakarta': [-6.2088, 106.8456],
        'Rio de Janeiro': [-22.9068, -43.1729],
        'Chicago': [41.8781, -87.6298],
        'Tehran': [35.6892, 51.3890],
        'Baghdad': [33.3152, 44.3661],
        'Karachi': [24.8607, 67.0011],
        'Lagos': [6.5244, 3.3792],
        'Madrid': [40.4168, -3.7038],
        'Kuala Lumpur': [3.1390, 101.6869],
        'Santiago': [-33.4489, -70.6693],
        'Lima': [-12.0464, -77.0428],
        'Athens': [37.9838, 23.7275],
    };

    /**
     * Convert latitude and longitude coordinates to a 3D vector on a unit sphere
     */
    static latLongToVector3(coords: [number, number]): Vector3 {
        const lat = coords[0];
        const long = coords[1];

        // Convert latitude and longitude from degrees to radians
        const latRad = lat * Math.PI / 180;
        const longRad = long * Math.PI / 180;

        // Compute the Cartesian coordinates
        const x = Math.cos(latRad) * Math.cos(longRad);
        const y = Math.sin(latRad);
        const z = -Math.cos(latRad) * Math.sin(longRad);

        return new Vector3(x, y, z);
    }

    /**
     * Create a quaternion that rotates the Earth to focus on a specific location
     */
    static quaternionToLocation(coords: [number, number]): Quaternion {
        const lat = coords[0];
        const long = coords[1];

        // First rotate around Z-axis (longitude)
        let dest = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), -Math.PI - long * Math.PI / 180);
        // Then rotate around X-axis (latitude)
        dest = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2 + lat * Math.PI / 180).multiply(dest);

        return dest;
    }

    /**
     * Create a quaternion for a location by name
     */
    static quaternionToLocationByName(locationName: string): Quaternion | null {
        const coords = this.latLongs[locationName];
        if (!coords) {
            console.warn(`Location "${locationName}" not found in latLongs`);
            return null;
        }
        return this.quaternionToLocation(coords);
    }

    /**
     * Convert degrees to radians
     */
    static radians(degrees: number): number {
        return degrees * Math.PI / 180;
    }
} 