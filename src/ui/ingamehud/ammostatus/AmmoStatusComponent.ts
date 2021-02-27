import { Assets, AssetUrls } from '../../../asset/Assets'
import { ClientPlayer } from '../../../cliententity/clientplayer/ClientPlayer'
import { Sprite } from '../../../engine/display/Sprite'
import { IWeapon } from '../../../weapon/Weapon'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { AmmoStatusAnimator, IAmmoStatusAnimator } from './AmmoStatusAnimator'
import { AmmoStatusCounterComponent } from './AmmoStatusCounterComponent'
import { WeaponHint } from './WeaponHint'

export interface IAmmoStatusComponent extends IUIComponent {
    
}

export class AmmoStatusComponent extends UIComponent implements IAmmoStatusComponent {
    _currentWeapon: IWeapon
    animator: IAmmoStatusAnimator
    backgroundSprite: Sprite
    counterComponent: AmmoStatusCounterComponent
    weaponHint: WeaponHint
    player: ClientPlayer

    constructor() {
        super()
        const backgroundTexture = PIXI.Texture.from(Assets.get(AssetUrls.AMMO_STATUS_BG))

        this.backgroundSprite = new Sprite({ texture: backgroundTexture })
        this.animator = new AmmoStatusAnimator({ ammoStatus: this })
        this.counterComponent = new AmmoStatusCounterComponent({ parent: this })

        this.addChild(this.backgroundSprite)
        this.addChild(this.counterComponent)
    }

    update() {
        if (this.player !== undefined) {
            const currentWeapon = this.player.holster.currentWeapon
            if (this.currentWeapon !== currentWeapon
            && currentWeapon !== undefined) {
                this.currentWeapon = currentWeapon
            }
        }

        if (this.weaponHint) {
            this.weaponHint.update()
        }
    }

    refreshClientLoadout() {
        this.player = ClientPlayer.getInstance()

        if (this.weaponHint === undefined) {
            this.weaponHint = new WeaponHint()
        } else {
            this.removeChild(this.weaponHint)
        }

        this.weaponHint.configure(this.player)

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

    set currentWeapon(value: IWeapon) {
        this.counterComponent.tempTextSprite.text = value.name
        this._currentWeapon = value
    }
}
