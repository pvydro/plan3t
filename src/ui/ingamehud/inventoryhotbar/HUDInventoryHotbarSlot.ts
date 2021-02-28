import { Graphix } from '../../../engine/display/Graphix'
import { IUIComponent, UIComponent } from '../../UIComponent'

export interface IHUDInventoryHotbarSlot extends IUIComponent {

}

export class HUDInventoryHotbarSlot extends UIComponent implements IHUDInventoryHotbarSlot {
    borderGraphics: Graphix
    borderWidth: number = 8

    constructor() {
        super()

        this.initializeGraphics()
    }

    initializeGraphics() {
        this.borderGraphics = new Graphix()
        this.borderGraphics.beginFill(0xFFFFFF)
        this.borderGraphics.drawRect(0, 0, this.borderWidth, 1)
        this.addChild(this.borderGraphics)
    }
}
