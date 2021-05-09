import { Assets, AssetUrls } from '../../../asset/Assets'
import { ClientPlayer } from '../../../cliententity/clientplayer/ClientPlayer'
import { ISprite, Sprite } from '../../../engine/display/Sprite'
import { GameWindow } from '../../../utils/Constants'
import { UIDefaults } from '../../../utils/Defaults'
import { IWeapon } from '../../../weapon/Weapon'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { AmmoStatusAnimator, IAmmoStatusAnimator } from './AmmoStatusAnimator'
import { AmmoStatusCounterComponent } from './AmmoStatusCounterComponent'
import { WeaponHint } from './WeaponHint'
import { WeaponLabel } from './WeaponLabel'

export interface IAmmoStatusComponent extends IUIComponent {
    backgroundSprite: ISprite
}

export class AmmoStatusComponent extends UIComponent implements IAmmoStatusComponent {
    _currentWeapon?: IWeapon
    _backgroundSprite: Sprite
    counterComponent: AmmoStatusCounterComponent
    weaponLabel: WeaponLabel
    weaponHint: WeaponHint

    animator: IAmmoStatusAnimator
    player: ClientPlayer

    constructor() {
        super()
        const backgroundTexture = PIXI.Texture.from(Assets.get(AssetUrls.AMMO_STATUS_BG))

        this._backgroundSprite = new Sprite({ texture: backgroundTexture })
        this.animator = new AmmoStatusAnimator({ ammoStatus: this })
        this.counterComponent = new AmmoStatusCounterComponent({ parent: this })
        this.weaponLabel = new WeaponLabel({ ammoStatus: this })

        this.addChild(this.backgroundSprite)
        this.addChild(this.counterComponent)
        this.addChild(this.weaponLabel)
    }

    update() {
        if (this.player !== undefined) {
            const currentWeapon = this.player.holster.currentWeapon

            // Automatically get current weapon from player
            if (this.currentWeapon !== currentWeapon
            && currentWeapon !== undefined) {
                this.currentWeapon = currentWeapon
                this.counterComponent.setWeapon(currentWeapon)
                this.weaponLabel.setWeapon(currentWeapon)
            }
            
            // Check current weapon status
            if (currentWeapon !== undefined
            && currentWeapon.triggerDown
            && currentWeapon.currentClipBullets <= 0) {
                this.weaponLabel.triggerNoAmmoAnim()
            }
        }
                    
        if (this.weaponHint) {
            this.weaponHint.update()
        }
        this.weaponLabel.update()
        this.counterComponent.update()
    }

    refreshClientLoadout() {
        this.player = ClientPlayer.getInstance()

        if (this.weaponHint === undefined) {
            this.weaponHint = new WeaponHint({ ammoStatus: this })
        } else {
            this.removeChild(this.weaponHint)
        }

        this.weaponHint.configure(this.player)

        this.addChild(this.weaponHint)
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        const topMargin = UIDefaults.DefaultBleedPastBorderMargin //- UIDefaults.UIEdgePadding

        this.position.x = UIDefaults.UIEdgePadding,
        this.position.y = GameWindow.height + topMargin
            - (this.backgroundSprite.height * UIDefaults.UIScale)

        this.counterComponent.reposition(false)
        this.weaponLabel.reposition(false)
    }

    async show() {
        super.show()

        return this.animator.show()
    }
    
    async hide() {
        super.hide()

        return this.animator.hide()
    }

    get backgroundSprite() {
        return this._backgroundSprite
    }

    set currentWeapon(value: IWeapon) {
        // this.counterComponent.tempTextSprite.text = value.name
        this._currentWeapon = value
    }
}
