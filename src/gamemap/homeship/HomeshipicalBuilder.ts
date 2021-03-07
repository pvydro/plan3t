import { Assets, AssetUrls } from '../../asset/Assets'
import { Container } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { Rect } from '../../engine/math/Rect'
import { Flogger } from '../../service/Flogger'
import { SphericalResponse } from '../spherical/SphericalBuilder'
import { SphericalHelper } from '../spherical/SphericalHelper'
import { HomeshipicalRespone, IHomeshipical } from './Homeshipical'
import { HomeshipicalModuleBuilder, IHomeshipicalModuleBuilder } from './HomeshipicalModuleBuilder'

export interface IHomeshipicalBuilder {
    buildLocalHomeshipical(): Promise<SphericalResponse>
}

export interface HomeshipicalBuilderOptions {
    homeship: IHomeshipical
}

export class HomeshipicalBuilder implements IHomeshipicalBuilder {
    moduleBuilder: IHomeshipicalModuleBuilder
    
    constructor(options: HomeshipicalBuilderOptions) {
        const homeship = options.homeship
        this.moduleBuilder = new HomeshipicalModuleBuilder({ homeship })
    }

    async buildLocalHomeshipical(): Promise<HomeshipicalRespone> {
        const tileLayer = new Container()
        const homeshipTexture = PIXI.Texture.from(Assets.get(AssetUrls.HOME_SHIP))
        const homeshipSprite = new Sprite({ texture: homeshipTexture })
        const moduleLayer = this.buildHomeshipModules()
        
        tileLayer.addChild(homeshipSprite)

        const collisionRects = this.buildCollisionRectsFromHomeshipical(homeshipSprite)

        return {
            tileLayer,
            collisionRects,
            moduleLayer
        }
    }

    private buildCollisionRectsFromHomeshipical(homeshipSprite: Sprite): Rect[] {
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

    private buildHomeshipModules(): Container {
        Flogger.log('HomeshipicalBuilder', 'buildHomeshipicalModules')
        
        return this.moduleBuilder.buildHomeshipicalModules()
    }
}
