import { Assets, AssetUrls } from '../../asset/Assets'
import { Container } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { Rect } from '../../engine/math/Rect'
import { Flogger } from '../../service/Flogger'
import { SphericalHelper } from '../spherical/SphericalHelper'
import { HomeshipicalRespone, IHomeshipical } from './Homeshipical'

export interface IHomeshipicalBuilder {
    buildLocalHomeshipical(): Promise<HomeshipicalRespone>
}

export interface HomeshipicalBuilderOptions {
    homeship: IHomeshipical
}

export class HomeshipicalBuilder implements IHomeshipicalBuilder {
    
    constructor(options: HomeshipicalBuilderOptions) {
        const homeship = options.homeship

    }

    async buildLocalHomeshipical(): Promise<HomeshipicalRespone> {
        const tileLayer = new Container()
        const homeshipTexture = PIXI.Texture.from(Assets.get(AssetUrls.HOME_SHIP))
        const homeshipSprite = new Sprite({ texture: homeshipTexture })
        const collisionRects = this.buildCollisionRectsFromHomeshipical(homeshipSprite)
        
        tileLayer.addChild(homeshipSprite)


        return {
            tileLayer,
            collisionRects
        }
    }

    private buildCollisionRectsFromHomeshipical(homeshipSprite: Sprite): Rect[] {
        Flogger.log('HomeshipicalBuilder', 'buildCollisionRectsFromHomeshipical')

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
