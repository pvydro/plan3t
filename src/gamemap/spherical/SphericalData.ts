import { Dimension } from '../../engine/math/Dimension'
export enum SphericalBiome {
    CloningFacility = 'cloningfacility',
    Kepler = 'kepler'
}

export interface ISphericalData {
    points: SphericalPoint[]
    biome: SphericalBiome
    dimension: Dimension
}

export interface SphericalPoint {
    x: number
    y: number
    tileValue: { r: number, g: number, b: number }
    tileDepth: number
}

export class SphericalData implements ISphericalData {
    points: SphericalPoint[]
    biome: SphericalBiome
    dimension: Dimension

    constructor(data: ISphericalData) {
        this.points = data.points
        this.biome = data.biome
        this.dimension = data.dimension
    }

    getPointAt(x: number, y: number): SphericalPoint {
        return this.points.find((point) => (point.x == x && point.y == y))
    }
}
