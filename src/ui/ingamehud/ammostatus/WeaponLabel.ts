import { TextSprite } from '../../../engine/display/TextSprite'
import { Tween } from '../../../engine/display/tween/Tween'
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
    }

    setWeapon(weapon: IWeapon) {
        if (this.currentWeapon !== weapon) {
            this.currentWeapon = weapon
    
            this.reconfigureName()
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

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        const leftPadding = 2
        const topMargin = this.ammoStatus.backgroundSprite.height
            - this.textSprite.textHeight

        this.originalX = leftPadding
        this.x = this.originalX
        this.y = topMargin
    }
}
