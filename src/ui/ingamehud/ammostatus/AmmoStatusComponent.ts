import { Assets, AssetUrls } from "../../../asset/Assets";
import { Sprite } from "../../../engine/display/Sprite";
import { UIComponent } from "../../UIComponent";

export interface IAmmoStatusComponent {
    
}

export class AmmoStatusComponent extends UIComponent implements IAmmoStatusComponent {
    backgroundSprite: Sprite

    constructor() {
        super()

        const backgroundTexture = PIXI.Texture.from(Assets.get(AssetUrls.AMMO_STATUS_BG))
        this.backgroundSprite = new Sprite({ texture: backgroundTexture })
        this.backgroundSprite.anchor.set(1, 0)

        this.addChild(this.backgroundSprite)
    }
}
