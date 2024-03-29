import { Key } from 'ts-keycode-enum'
import { Animator } from '../../../engine/display/Animator'
import { Sprite } from '../../../engine/display/Sprite'
import { Tween } from '../../../engine/display/tween/Tween'
import { IInteractiveContainer, InteractiveContainer, InteractiveContainerOptions } from '../../../engine/interaction/InteractiveContainer'
import { IRect } from '../../../engine/math/Rect'
import { IUpdatable } from '../../../interface/IUpdatable'
import { toolTipMan } from '../../../shared/Dependencies'
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
    animator: Animator
    sprite?: Sprite
    currentGround: IRect
    xTile: number
    tooltip?: InGameTooltip
    highlightAnimation: TweenLite
    unhighlightAnimation: TweenLite

    constructor(options?: HomeshipicalModuleOptions) {
        options.interactiveBounds = {
            width: 72,
            height: options.sprite ? options.sprite.height : 64
        }
        options.addWalkZone = true
        super(options)
        
        this.animator = new Animator()

        if (options !== undefined) {
            if (options.sprite !== undefined) {
                this.sprite = options.sprite
                this.addChild(this.sprite)
            }

            if (options.shouldAddTooltip === true) {
                const keyText = Key[this.interactKey]
                const tooltipPadding = 4

                this.tooltip = toolTipMan.addTooltip({
                    type: TooltipType.Key,
                    text: { text: keyText },
                    hideByDefault: true,
                    targetToFollow: {
                        target: this,
                        xOffset: (this.interactiveBounds.width / 1.5) - this.sprite.halfWidth - tooltipPadding,
                        yOffset: (this.interactiveBounds.height / 2)
                    },
                })
            }

            this.xTile = options.xTile ?? 0
        }

        this.highlightAnimation = Tween.to(this, {
            alpha: 0.5,
            duration: 2
        })
        this.unhighlightAnimation = Tween.to(this, {
            alpha: 1,
            duration: 0.5
        })
    }

    async highlight() {
        this.tooltip.used()
        this.animator.currentAnimation = this.highlightAnimation
        this.animator.play()
    }

    async unhighlight() {
        this.animator.currentAnimation = this.unhighlightAnimation
        this.animator.play()
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
