import { Assets, AssetUrls } from '../../../asset/Assets'
import { Camera } from '../../../camera/Camera'
import { IClientPlayer } from '../../../cliententity/clientplayer/ClientPlayer'
import { Sprite } from '../../../engine/display/Sprite'
import { IUpdatable } from '../../../interface/IUpdatable'
import { UIComponent } from '../../UIComponent'

export interface IOverheadHealthBar extends IUpdatable {

}

export interface OverheadHealthBarOptions {
    player: IClientPlayer
}

export class OverheadHealthBar extends UIComponent implements IOverheadHealthBar {
    backgroundSprite: Sprite
    player: IClientPlayer

    constructor(options: OverheadHealthBarOptions) {
        super()

        this.player = options.player

        const backgroundTexture = PIXI.Texture.from(Assets.get(AssetUrls.OVERHEAD_HEALTHB_BAR_BG))
        this.backgroundSprite = new Sprite({ texture: backgroundTexture })

        this.addChild(this.backgroundSprite)
    }

    update() {
        const playerPositionProjected = Camera.toScreen(this.player.position)
        
        this.x = playerPositionProjected.x
        this.y = playerPositionProjected.y
    }
}
