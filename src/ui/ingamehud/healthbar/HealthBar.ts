import { Assets, AssetUrls } from '../../../asset/Assets'
import { UIComponent } from '../../../ui/UIComponent'
import { Sprite } from '../../../engine/display/Sprite'

export interface IHealthBar {

}

export class HealthBar extends UIComponent implements IHealthBar {
    backgroundSprite: Sprite
    fillSprite: Sprite
    
    constructor() {
        super()
        
        const backgroundTexture = PIXI.Texture.from(Assets.get(AssetUrls.HEALTH_BAR_BG))
        this.backgroundSprite = new Sprite({ texture: backgroundTexture })

        const fillTexture = PIXI.Texture.from(Assets.get(AssetUrls.HEALTH_BAR_FILL))
        this.fillSprite = new Sprite({ texture: fillTexture })

        this.fillSprite.position.set(6, 4)

        this.addChild(this.backgroundSprite)
        this.addChild(this.fillSprite)
    }
}
