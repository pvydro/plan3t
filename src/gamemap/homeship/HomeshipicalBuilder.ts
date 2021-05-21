import { Assets, AssetUrls } from '../../asset/Assets'
import { Container } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { Rect } from '../../engine/math/Rect'
import { log } from '../../service/Flogger'
import { GameMapContainerBuilderResponse } from '../GameMapContainer'
import { SphericalHelper } from '../spherical/SphericalHelper'
import { IHomeshipical } from './Homeshipical'

export interface IHomeshipicalBuilder {
    buildLocalHomeshipical(): Promise<GameMapContainerBuilderResponse>
}

export class HomeshipicalBuilder implements IHomeshipicalBuilder {
    
    constructor() {

    }

    async buildLocalHomeshipical(): Promise<GameMapContainerBuilderResponse> {
        const tileLayer = new Container()
        const homeshipTexture = PIXI.Texture.from(Assets.get(AssetUrls.Homeship))
        const homeshipSprite = new Sprite({ texture: homeshipTexture })
        const collisionRects = this.buildCollisionRectsFromHomeshipical(homeshipSprite)
        
        tileLayer.addChild(homeshipSprite)

        return {
            tileLayer,
            collisionRects
        }
    }

    private buildCollisionRectsFromHomeshipical(homeshipSprite: Sprite): Rect[] {
        log('HomeshipicalBuilder', 'buildCollisionRectsFromHomeshipical')

        const collisionRects = []
        const groundTiles = 3
        const tileSize = SphericalHelper.getTileSize()
        const x = 0
        const y = homeshipSprite.height - (tileSize * groundTiles)
        const width = homeshipSprite.width - (tileSize * 2)
        const height = tileSize
        const groundRect = new Rect({
            x, y,
            width, height
        })

        collisionRects.push(groundRect)

        return collisionRects
    }
}
