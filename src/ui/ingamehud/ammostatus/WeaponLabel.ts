import { TextSprite } from '../../../engine/display/TextSprite'
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

    reconfigureName() {
        const newName = this.currentWeapon.name.toUpperCase()
        
        this.textSprite.text = newName
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        const leftPadding = 4
        const topMargin = this.ammoStatus.backgroundSprite.height
            - this.textSprite.textHeight

        this.x = leftPadding
        this.y = topMargin
    }
}
