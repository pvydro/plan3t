import { Assets, AssetUrls } from '../../../asset/Assets'
import { ClientPlayer } from '../../../cliententity/clientplayer/ClientPlayer'
import { Sprite } from '../../../engine/display/Sprite'
import { Flogger } from '../../../service/Flogger'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { AmmoStatusAnimator, IAmmoStatusAnimator } from './AmmoStatusAnimator'
import { WeaponHint } from './WeaponHint'

export interface IAmmoStatusComponent extends IUIComponent {
    
}

export class AmmoStatusComponent extends UIComponent implements IAmmoStatusComponent {
    animator: IAmmoStatusAnimator
    backgroundSprite: Sprite
    weaponHint: WeaponHint

    constructor() {
        super()
        const backgroundTexture = PIXI.Texture.from(Assets.get(AssetUrls.AMMO_STATUS_BG))

        this.backgroundSprite = new Sprite({ texture: backgroundTexture })
        this.animator = new AmmoStatusAnimator({ ammoStatus: this })

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

    async show() {
        super.show()

        return this.animator.show()
    }
    
    async hide() {
        super.hide()

        return this.animator.hide()
    }
}
