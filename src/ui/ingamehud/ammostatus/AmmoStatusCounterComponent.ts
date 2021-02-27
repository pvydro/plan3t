import { TextSprite } from '../../../engine/display/TextSprite'
import { UIComponent } from '../../UIComponent'
import { AmmoStatusComponent } from './AmmoStatusComponent'

export interface IAmmoStatusCounterComponent {
    tempTextSprite: TextSprite
}

export interface AmmoStatusCounterComponentOptions {
    parent: AmmoStatusComponent
}

export class AmmoStatusCounterComponent extends UIComponent implements IAmmoStatusCounterComponent {
    tempTextSprite: TextSprite

    constructor(options: AmmoStatusCounterComponentOptions) {
        super()

        this.tempTextSprite = new TextSprite({
            text: ''
        })

        this.addChild(this.tempTextSprite)
    }
}
