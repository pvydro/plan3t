import { Container, IContainer } from '../../../engine/display/Container'
import { Sprite } from '../../../engine/display/Sprite'
import { IRect } from '../../../engine/math/Rect'
import { IUpdatable } from '../../../interface/IUpdatable'
import { SphericalHelper } from '../../spherical/SphericalHelper'

export interface IHomeShipicalModule extends IContainer, IUpdatable {
    attachToGround(ground: IRect): void
    interact(): void
}

export interface HomeshipicalModuleOptions {
    sprite?: Sprite
    xTile?: number
}

export class HomeshipicalModule extends Container implements IHomeShipicalModule {
    sprite?: Sprite
    currentGround: IRect
    xTile: number

    constructor(options?: HomeshipicalModuleOptions) {
        super()

        if (options !== undefined) {
            if (options.sprite !== undefined) {
                this.sprite = options.sprite
                this.addChild(this.sprite)
            }

            this.xTile = options.xTile ?? 0
        }

        
    }

    update() {

    }
    
    interact() {

    }

    attachToGround(ground: IRect) {
        const tileSize = SphericalHelper.getTileSize()
        
        this.currentGround = ground
        this.y = this.currentGround.y
        this.x = tileSize * this.xTile
        if (this.sprite) {
            this.y -= this.sprite.height
        }
    }
}
