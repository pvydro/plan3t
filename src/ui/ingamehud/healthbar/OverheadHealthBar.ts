import { Assets, AssetUrls } from '../../../asset/Assets'
import { Camera } from '../../../camera/Camera'
import { IClientPlayer } from '../../../cliententity/clientplayer/ClientPlayer'
import { Sprite } from '../../../engine/display/Sprite'
import { IUpdatable } from '../../../interface/IUpdatable'
import { UIConstants } from '../../../utils/Constants'
import { UIComponent } from '../../UIComponent'

export interface IOverheadHealthBar extends IUpdatable {

}

export interface OverheadHealthBarOptions {
    player: IClientPlayer
}

export class OverheadHealthBar extends UIComponent implements IOverheadHealthBar {
    backgroundSprite: Sprite
    player: IClientPlayer
    fillSprite: Sprite
    fillSpriteWidth: number
    targetFillPercentage: number = 1
    fillPercentage: number = this.targetFillPercentage
    fillDivisor: number = 5

    constructor(options: OverheadHealthBarOptions) {
        super()

        this.player = options.player

        const backgroundTexture = PIXI.Texture.from(Assets.get(AssetUrls.OVERHEAD_HEALTHB_BAR_BG))
        this.backgroundSprite = new Sprite({ texture: backgroundTexture })
        this.backgroundSprite.anchor.set(0.5, 0.5)

        const fillTexture = PIXI.Texture.from(Assets.get(AssetUrls.OVERHEAD_HEALTHB_BAR_FILL))
        this.fillSprite = new Sprite({ texture: fillTexture })
        this.fillSprite.anchor.set(0, 0.5)
        this.fillSprite.x = -this.backgroundSprite.halfWidth + 3
        this.fillSpriteWidth = this.fillSprite.width

        this.addChild(this.backgroundSprite)
        this.addChild(this.fillSprite)

        this.position.y = -32
    }

    update() {
        if (this.targetFillPercentage !== this.player.healthPercentage) {
            this.targetFillPercentage = this.player.healthPercentage
        }

        if (this.fillPercentage !== this.targetFillPercentage) {
            this.fillPercentage += (this.targetFillPercentage - this.fillPercentage) / this.fillDivisor
    
            // Cap outat 0.01 breakpoint
            if (this.fillPercentage < this.targetFillPercentage + 0.01) this.fillPercentage = this.targetFillPercentage

            this.fillSprite.width = this.fillSpriteWidth * this.fillPercentage
        }
    }
}
