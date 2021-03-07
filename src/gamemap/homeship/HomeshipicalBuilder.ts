import { Assets, AssetUrls } from '../../asset/Assets'
import { Container } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { Rect } from '../../engine/math/Rect'
import { SphericalResponse } from '../spherical/SphericalBuilder'
import { SphericalHelper } from '../spherical/SphericalHelper'

export interface IHomeshipicalBuilder {
    buildLocalHomeshipical(): Promise<SphericalResponse>
}

export class HomeshipicalBuilder implements IHomeshipicalBuilder {

    constructor() {}

    async buildLocalHomeshipical(): Promise<SphericalResponse> {
        const tileLayer = new Container()
        const homeshipTexture = PIXI.Texture.from(Assets.get(AssetUrls.HOME_SHIP))
        const homeshipSprite = new Sprite({ texture: homeshipTexture })
        
        tileLayer.addChild(homeshipSprite)

        const collisionRects = this.buildCollisionRectsFromHomeshipical(homeshipSprite)

        return {
            tileLayer,
            collisionRects
        }
    }

    private buildCollisionRectsFromHomeshipical(homeshipSprite: Sprite): Rect[] {
        const collisionRects = []
        const tileSize = SphericalHelper.getTileSize()
        const x = -tileSize // tileSize
        const y = 0
        const width = homeshipSprite.width - (tileSize * 2)
        const height = tileSize
        const groundRect = new Rect(x, y, width, height)

        collisionRects.push(groundRect)

        return collisionRects
    }
}
