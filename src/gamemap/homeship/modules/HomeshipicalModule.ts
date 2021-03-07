import { Container, IContainer } from '../../../engine/display/Container'
import { Sprite } from '../../../engine/display/Sprite'
import { IRect } from '../../../engine/math/Rect'
import { IUpdatable } from '../../../interface/IUpdatable'

export interface IHomeShipicalModule extends IContainer, IUpdatable {
    attachToGround(ground: IRect)
}

export interface HomeshipicalModuleOptions {
    sprite?: Sprite
}

export class HomeshipicalModule extends Container implements IHomeShipicalModule {
    sprite?: Sprite

    currentGround: IRect

    constructor(options?: HomeshipicalModuleOptions) {
        super()

        if (options !== undefined) {
            if (options.sprite !== undefined) {
                this.sprite = options.sprite
                this.addChild(this.sprite)
            }
        }
    }

    update() {
        this.y = this.currentGround.y - this.height
    }
    
    attachToGround(ground: IRect) {
        this.currentGround = ground
    }
}
