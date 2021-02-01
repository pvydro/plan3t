import { Assets, AssetUrls } from '../../../asset/Assets'
import { ClientPlayer } from '../../../cliententity/clientplayer/ClientPlayer'
import { Sprite } from '../../../engine/display/Sprite'
import { UIComponent } from '../../UIComponent'
import { WeaponHint } from './WeaponHint'

export interface IAmmoStatusComponent {
    
}

export class AmmoStatusComponent extends UIComponent implements IAmmoStatusComponent {
    backgroundSprite: Sprite
    weaponHint: WeaponHint

    constructor() {
        super()

        const backgroundTexture = PIXI.Texture.from(Assets.get(AssetUrls.AMMO_STATUS_BG))

        this.backgroundSprite = new Sprite({ texture: backgroundTexture })
        this.addChild(this.backgroundSprite)
    }

    refreshClientLoadout() {
        const player = ClientPlayer.getInstance()

        if (this.weaponHint === undefined) {
            this.weaponHint = new WeaponHint()
        } else {
            this.removeChild(this.weaponHint)
        }

        this.weaponHint.configure(player)

        this.addChild(this.weaponHint)
    }
}
