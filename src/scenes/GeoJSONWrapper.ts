import { Geometry, GeometryCollection, Position } from 'geojson';
import { Vector3 } from '../vector/src';

export type Topology = {
    type: 'Topology';
    transform?: Transform;
    objects: Record<string, GeometryCollection>;
    arcs: Position[][];
    bbox?: number[];
};

export type Transform = {
    scale: [number, number];
    translate: [number, number];
};

export function transformPoint(transform: Transform, position: Position): Position {
    return [
        position[0] * transform.scale[0] + transform.translate[0],
        position[1] * transform.scale[1] + transform.translate[1]
    ];
}

export function decodeArc(transform: Transform | undefined, arc: Position[]): Position[] {
    let x = 0, y = 0;
    return arc.map(position => {
        const newPosition: Position = [0, 0];
        newPosition[0] = (x += position[0]);
        newPosition[1] = (y += position[1]);
        if (transform) {
            return transformPoint(transform, newPosition);
        }
        return newPosition;
    });
}

export function extractPolygons(topology: Topology): Position[][][] {
    const polygons: Position[][][] = [];

    for (const objectKey in topology.objects) {
        const geometryCollection = topology.objects[objectKey];
        for (const geometry of geometryCollection.geometries) {
            extractGeometry(geometry, topology.transform, topology.arcs, polygons);
        }
    }

    return polygons;
}

function extractGeometry(geometry: Geometry, transform: Transform | undefined, arcs: Position[][], polygons: Position[][][]) {
    if (geometry.type === "GeometryCollection" && (geometry as GeometryCollection).geometries) {
        (geometry as GeometryCollection).geometries.forEach(geo => extractGeometry(geo, transform, arcs, polygons));
    } else if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
        const polygonArcs = (geometry as any).arcs as (number | number[])[];
        polygonArcs.forEach(rings => {
            const polygon: Position[][] = [];
            (Array.isArray(rings) ? rings : [rings]).forEach(arcIndexes => {
                const ring: Position[] = [];
                let first = true;
                (Array.isArray(arcIndexes) ? arcIndexes : [arcIndexes]).forEach(arcIndex => {
                    let arc = arcIndex >= 0 ? arcs[arcIndex] : arcs[~arcIndex].slice().reverse();
                    let decodedArc = decodeArc(transform, arc);

                    // Drop the first position of each subsequent arc except the first
                    if (!first) {
                        decodedArc.shift();
                    }
                    first = false;

                    ring.push(...decodedArc);
                });
                polygon.push(ring);
            });
            polygons.push(polygon);
        });
    }
}

export function positionToVector3(longitude: number, latitude: number): Vector3 {
    const lonRad = Math.PI/2 + longitude * (Math.PI / 180);
    const latRad = latitude * (Math.PI / 180);

    const x = Math.cos(latRad) * Math.cos(lonRad);
    const y = Math.cos(latRad) * Math.sin(lonRad);
    const z = Math.sin(latRad);

    return new Vector3(x, y, z);
}