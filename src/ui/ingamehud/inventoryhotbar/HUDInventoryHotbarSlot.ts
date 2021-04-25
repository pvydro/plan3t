import { Graphix } from '../../../engine/display/Graphix'
import { TextSprite } from '../../../engine/display/TextSprite'
import { IUIComponent, UIComponent } from '../../UIComponent'

export interface IHUDInventoryHotbarSlot extends IUIComponent {

}

export interface HUDInventoryHotbarSlotOptions {
    hotbarKey: number
}

export class HUDInventoryHotbarSlot extends UIComponent implements IHUDInventoryHotbarSlot {
    borderGraphics: Graphix
    borderWidth: number = 8
    hotbarKey: number
    hotbarKeyString: string
    hotbarKeyTextSprite: TextSprite

    constructor(options: HUDInventoryHotbarSlotOptions) {
        super()

        this.hotbarKey = options.hotbarKey
        this.hotbarKeyString = this.getKeyStringForKey(this.hotbarKey)

        this.initializeGraphics()
    }

    initializeGraphics() {
        this.hotbarKeyTextSprite = new TextSprite({
            text: this.hotbarKeyString,
            style: {
                fontSize: 8,
                rescale: 0.35
            }
        })
        this.hotbarKeyTextSprite.y -= this.hotbarKeyTextSprite.textHeight + 1

        this.borderGraphics = new Graphix()
        this.borderGraphics.beginFill(0xFFFFFF)
        this.borderGraphics.drawRect(0, 0, this.borderWidth, 1)

        this.addChild(this.borderGraphics)
        this.addChild(this.hotbarKeyTextSprite)
    }

    getKeyStringForKey(key: number): string {
        let keyString = 'X'

        switch (key) {
            case 1:
                keyString = 'I'
                break
            case 2:
                keyString = 'II'
                break
            case 3:
                keyString = 'III'
                break
            case 4:
                keyString = 'IV'
                break
            case 5:
                keyString = 'V'
                break
            case 6:
                keyString = 'VI'
                break
            case 7:
                keyString = 'VII'
                break
            case 8:
                keyString = 'VIII'
                break
        }

        return keyString
    }
}
