import { Assets, AssetUrls } from '../../../../asset/Assets'
import { Sprite } from '../../../../engine/display/Sprite'
import { getRandomIntBetween } from '../../../../utils/Math'
import { SphericalTile } from '../SphericalTile'

export interface ISphericalTileFoliage {

}

export interface SphericalTileFoliageOptions {
    tile: SphericalTile
}

export class SphericalTileFoliage extends Sprite implements ISphericalTileFoliage {
    static TotalFoliages = 6

    constructor(options: SphericalTileFoliageOptions) {

        const textureDir = SphericalTileFoliage.findFoliageAssetUrlForTile(options.tile)
        const texture = PIXI.Texture.from(Assets.get(textureDir))

        super({ texture })
    }

    private static findFoliageAssetUrlForTile(tile: SphericalTile) {
        const chosenFoliage = getRandomIntBetween(0, SphericalTileFoliage.TotalFoliages)
        const assetUrl = Assets.TileDir + tile.biome + '/foliage' + chosenFoliage

        return assetUrl
    }
}
