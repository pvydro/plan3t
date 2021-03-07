import { Graphix } from '../../engine/display/Graphix'
import { UIButton, UIButtonType } from '../uibutton/UIButton'
import { IUIComponent, UIComponent } from '../UIComponent'

export interface IInGameInventorySlot extends IUIComponent {

}

export class InGameInventorySlot extends UIButton implements IInGameInventorySlot {
    constructor() {
        const backgroundGraphic = new Graphix()
        backgroundGraphic.beginFill(0xFFFFFF)
        backgroundGraphic.drawIRect({ x: 0, y: 0, width: 16, height: 16 })
        backgroundGraphic.endFill()

        super({
            type: UIButtonType.HoverOnly,
            background: {
                graphic: backgroundGraphic
            }
        })
    }
}
