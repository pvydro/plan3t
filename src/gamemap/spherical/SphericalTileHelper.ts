import { SphericalTileColorData } from './SphericalTile'

export interface ISphericalTileHelper {

}

export class SphericalTileValues {
    public static CoreGrassTile: SphericalTileColorData = {
        r: 85, g: 163, b: 95, a: 1
    }
    public static CoreDirtTile: SphericalTileColorData = {
        r: 128, g: 85, b: 58, a: 1
    }
    public static CoreGroundTile: SphericalTileColorData = {
        r: 135, g: 135, b: 135, a: 1
    }
    public static MantleGroundTile: SphericalTileColorData = {
        r: 207, g: 106, b: 19, a: 1
    }
    public static InnerCoreTile: SphericalTileColorData = {
        r: 227, g: 163, b: 0, a: 1
    }
}

export class SphericalTileHelper {
    constructor() {
        
    }
}
