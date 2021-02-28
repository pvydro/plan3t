import { Key } from 'ts-keycode-enum'
import { TextSprite } from '../../../engine/display/TextSprite'
import { Tween } from '../../../engine/display/tween/Tween'
import { Easing } from '../../../engine/display/tween/TweenEasing'
import { InputEvents, InputProcessor } from '../../../input/InputProcessor'
import { Flogger } from '../../../service/Flogger'
import { UIConstants } from '../../../utils/Constants'
import { IWeapon } from '../../../weapon/Weapon'
import { UIComponent } from '../../UIComponent'
import { AmmoStatusComponent } from './AmmoStatusComponent'

export interface IWeaponLabel {

}

export interface WeaponLabelOptions {
    ammoStatus: AmmoStatusComponent
}

export class WeaponLabel extends UIComponent implements IWeaponLabel {
    originalX: number
    textSprite: TextSprite
    ammoStatus: AmmoStatusComponent
    noAmmoTint: number = 0xde3333
    tintAnimation: TweenLite
    currentWeapon?: IWeapon

    constructor(options: WeaponLabelOptions) {
        super()

        this.ammoStatus = options.ammoStatus
        this.textSprite = new TextSprite({
            text: '',
            fontSize: 12
        })

        this.addChild(this.textSprite)
        this.reposition(false)

        InputProcessor.on(InputEvents.KeyDown, (ev) => {
            if (ev.which === Key.L) {
                this.triggerNoAmmoAnim()
            }
        })
    }

    setWeapon(weapon: IWeapon) {
        if (this.currentWeapon !== weapon) {
            this.currentWeapon = weapon
    
            this.reconfigureName()
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

        }
    }

    async reconfigureName() {
        const newName = this.currentWeapon.name.toUpperCase()
        
        if (this.textSprite.text != '') {
            await Tween.to(this.textSprite, {
                x: this.originalX + UIConstants.SwipeAnimationDistance,
                alpha: 0,
                duration: 0.5,
                autoplay: true
            })
        }

        this.textSprite.text = newName

        await Tween.to(this.textSprite, {
            x: this.originalX,
            alpha: 1,
            duration: 0.5,
            autoplay: true
        })
    }
}
