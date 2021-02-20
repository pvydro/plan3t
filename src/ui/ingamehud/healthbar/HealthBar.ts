import { Assets, AssetUrls } from '../../../asset/Assets'
import { UIComponent } from '../../../ui/UIComponent'
import { Sprite } from '../../../engine/display/Sprite'
import { Container } from 'pixi.js'

export interface IHealthBar {

}

export class HealthBar extends UIComponent implements IHealthBar {
    backgroundSprite: Sprite
    fillSprite: Sprite
    orientationContainer: Container
    
    constructor() {
        super()
        
        const backgroundTexture = PIXI.Texture.from(Assets.get(AssetUrls.HEALTH_BAR_BG))
        this.backgroundSprite = new Sprite({ texture: backgroundTexture })

        const fillTexture = PIXI.Texture.from(Assets.get(AssetUrls.HEALTH_BAR_FILL))
        this.fillSprite = new Sprite({ texture: fillTexture })

        this.fillSprite.position.set(6, 4)

        this.orientationContainer = new Container()

        this.addChild(this.orientationContainer)
        this.orientationContainer.addChild(this.backgroundSprite)
        this.orientationContainer.addChild(this.fillSprite)
        
        this.orientationContainer.scale.x = -1
    }

    forceHide() {
        this.alpha = 0
    }
}
