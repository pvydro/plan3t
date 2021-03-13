import { Key } from 'ts-keycode-enum'
import { Sprite } from '../../../engine/display/Sprite'
import { IInteractiveContainer, InteractiveContainer, InteractiveContainerOptions } from '../../../engine/interaction/InteractiveContainer'
import { IRect } from '../../../engine/math/Rect'
import { IUpdatable } from '../../../interface/IUpdatable'
import { TooltipManager } from '../../../manager/TooltipManager'
import { InGameTooltip, TooltipType } from '../../../ui/ingametooltip/InGameTooltip'
import { SphericalHelper } from '../../spherical/SphericalHelper'

export interface IHomeShipicalModule extends IInteractiveContainer, IUpdatable {
    attachToGround(ground: IRect): void
}

export interface HomeshipicalModuleOptions extends InteractiveContainerOptions {
    sprite?: Sprite
    xTile?: number
    shouldAddTooltip?: boolean
}

export class HomeshipicalModule extends InteractiveContainer implements IHomeShipicalModule {
    sprite?: Sprite
    currentGround: IRect
    xTile: number
    tooltip?: InGameTooltip

    constructor(options?: HomeshipicalModuleOptions) {
        super(options)

        if (options !== undefined) {
            if (options.sprite !== undefined) {
                this.sprite = options.sprite
                this.addChild(this.sprite)
            }

            if (options.shouldAddTooltip === true) {
                const keyText = Key[this.interactKey]

                this.tooltip = TooltipManager.getInstance().addTooltip({
                    type: TooltipType.Key,
                    text: { text: keyText },
                    hideByDefault: true,
                    targetToFollow: {
                        target: this,
                        center: true
                    },
                })
            }

            this.xTile = options.xTile ?? 0
        }
    }

    update() {
        super.update()
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
