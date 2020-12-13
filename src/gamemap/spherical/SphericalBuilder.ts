import { SphericalData, SphericalPoint } from './Spherical'
import { Assets, AssetUrls } from '../../asset/Assets'
import { Sprite } from '../../display/Sprite'
import { Dimension } from '../../math/Dimension'
import { Container } from '../../display/Container'

export interface ISphericalBuilder {
    buildSphericalFromData(data: SphericalData)
}

export class SphericalBuilder implements ISphericalBuilder {
    constructor() {

    }

    buildSphericalFromData(data: SphericalData) {
        const sphericalContainer = new Container()
        const points = data.points
        const tileResource = AssetUrls.TILE_DIR + data.biome + '/tile_0'
        const tileTexture = PIXI.Texture.from(Assets.get(tileResource))

        points.forEach((point: SphericalPoint) => {
            const tileSprite = new Sprite({ texture: tileTexture })
            const tileDimension = new Dimension(tileTexture.width, tileTexture.height)
            const tileX = point.x * tileDimension.width
            const tileY = point.y * tileDimension.height

            sphericalContainer.addChild(tileSprite)
            tileSprite.position.set(tileX, tileY)
        })

        return sphericalContainer
    }
}
