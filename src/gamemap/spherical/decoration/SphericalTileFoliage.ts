import { Assets, AssetUrls } from '../../../asset/Assets'
import { Sprite } from '../../../engine/display/Sprite'
import { NumberUtils } from '../../../utils/NumberUtils'
import { SphericalTile } from '../SphericalTile'

export interface ISphericalTileFoliage {

}

export interface SphericalTileFoliageOptions {
    tile: SphericalTile
}

export class SphericalTileFoliage extends Sprite implements ISphericalTileFoliage {
    constructor(options: SphericalTileFoliageOptions) {

        const textureDir = SphericalTileFoliage.findFoliageDirForTile(options.tile)
        const texture = PIXI.Texture.from(Assets.get(textureDir))

        super({ texture })
    }

    static findFoliageDirForTile(tile: SphericalTile) {
        const chosenFoliage = NumberUtils.getRandomIntegerBetween(0, 2)
        const tileDir = Assets.TILE_DIR + tile.biome + '/foliage' + chosenFoliage

        return tileDir
    }
}
