import { Camera } from '../../../camera/Camera'
import { TextSprite } from '../../../engine/display/TextSprite'
import { scaleFontSize, TextStyles } from '../../../engine/display/TextStyles'
import { Tween } from '../../../engine/display/tween/Tween'
import { Easing } from '../../../engine/display/tween/TweenEasing'
import { camera } from '../../../shared/Dependencies'
import { Defaults } from '../../../utils/Defaults'
import { IWeapon, WeaponState } from '../../../weapon/Weapon'
import { UIComponent } from '../../UIComponent'
import { IAmmoStatusComponent } from './AmmoStatusComponent'

export interface IWeaponLabel {

}

export interface WeaponLabelOptions {
    ammoStatus: IAmmoStatusComponent
}

export enum WeaponLabelState {
    WeaponName, Reloading
}

export class WeaponLabel extends UIComponent implements IWeaponLabel {
    state: WeaponLabelState = undefined
    originalX: number
    textSprite: TextSprite
    ammoStatus: IAmmoStatusComponent
    noAmmoTint: number = 0xde3333
    tintAnimation: TweenLite
    swipeAnimation: TweenLite
    currentWeapon?: IWeapon
    targetName: string

    constructor(options: WeaponLabelOptions) {
        super()

        this.ammoStatus = options.ammoStatus
        this.textSprite = new TextSprite({
            text: '',
            style: TextStyles.WeaponLabel
        })

        this.addChild(this.textSprite)
    }

    update() {
        if (this.currentWeapon !== undefined) {
            if (this.currentWeapon.state === WeaponState.Reloading
            && this.state !== WeaponLabelState.Reloading) {
                this.reconfigureLabel(WeaponLabelState.Reloading)
            } else if (this.currentWeapon.state === WeaponState.Loaded
            && this.state !== WeaponLabelState.WeaponName) {
                this.reconfigureLabel(WeaponLabelState.WeaponName)
            }
        }
    }

    setWeapon(weapon: IWeapon) {
        if (this.currentWeapon !== weapon
        || this.currentWeapon.state) {
            this.currentWeapon = weapon
            this.reconfigureLabel(WeaponLabelState.WeaponName)
        } else if (this.currentWeapon.state === WeaponState.Reloading
        && this.state !== WeaponLabelState.Reloading) {
            this.reconfigureLabel(WeaponLabelState.Reloading)
        }
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        const leftPadding = 2
        const topMargin = this.ammoStatus.backgroundSprite.height
            - this.textSprite.textHeight

        this.originalX = leftPadding
        this.x = this.originalX
        this.y = topMargin
    }

    triggerNoAmmoAnim() {        
        if (this.tintAnimation === undefined) {            
            this.textSprite.tint = this.noAmmoTint
            this.tintAnimation = Tween.to(this.textSprite, {
                pixi: {
                    tint: 0xFFFFFF,
                },
                delay: 0.15,
                autoplay: true,
                ease: Easing.Linear,
                duration: 0.5,
                onComplete: () => {
                    this.tintAnimation = undefined
                }
            })

            camera.shake(2)
        }
    }

    async reconfigureLabel(state: WeaponLabelState) {
        
        const newName = state === WeaponLabelState.Reloading
            ? 'RELOADING' : this.currentWeapon.name.toUpperCase()

        this.targetName = newName
        
        if (state === this.state
        && this.textSprite.text == newName) {
            return
        }
        this.state = state
        
        if (this.textSprite.text != '') {
            if (this.swipeAnimation == undefined) {
                this.swipeAnimation = Tween.to(this.textSprite, {
                    x: this.originalX + Defaults.SwipeAnimationDistance,
                    alpha: 0,
                    duration: state === WeaponLabelState.Reloading ? 0.1 : 0.5,
                    onComplete: () => {
                        this.swipeAnimation = undefined
                    }
                })
            }

            await this.swipeAnimation.play()
        }

        this.textSprite.setText(this.targetName)

        this.swipeAnimation = Tween.to(this.textSprite, {
            x: this.originalX,
            alpha: 1,
            duration: 0.5,
            onComplete: () => {
                this.swipeAnimation = undefined
            }
        })
        await this.swipeAnimation.play()
    }
}
