import { Assets, AssetUrls } from '../../../asset/Assets'
import { Container } from '../../../engine/display/Container'
import { Sprite } from '../../../engine/display/Sprite'

export interface IHealthBar {

}

export class HealthBar extends Container implements IHealthBar {
    backgroundSprite: Sprite
    fillSprite: Sprite
        
    constructor() {
        super()
        
        const backgroundTexture = PIXI.Texture.from(Assets.get(AssetUrls.HEALTH_BAR_BG))
        this.backgroundSprite = new Sprite({ texture: backgroundTexture })

        const fillTexture = PIXI.Texture.from(Assets.get(AssetUrls.HEALTH_BAR_FILL))
        this.fillSprite = new Sprite({ texture: fillTexture })

        this.fillSprite.position.set(3, 3)

        this.addChild(this.backgroundSprite)
        this.addChild(this.fillSprite)
    }
}
