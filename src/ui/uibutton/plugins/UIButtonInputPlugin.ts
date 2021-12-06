import { Container } from '../../../engine/display/Container'
import { Graphix } from '../../../engine/display/Graphix'
import { IUIButton } from '../UIButton'

export interface IUIButtonInputPlugin {
}

export interface UIButtonInputOptions {
    showOnClick?: boolean
    fieldWidth?: number
    fieldColor?: number
}

export class UIButtonInputPlugin extends Container implements IUIButtonInputPlugin {
    button: IUIButton
    inputOptions: UIButtonInputOptions
    inputGraphic: Graphix

    constructor(button: IUIButton, options: UIButtonInputOptions) {
        super()

        this.button = button
        this.inputOptions = options
    }

    initialize() {
        const fieldWidth = this.inputOptions.fieldWidth || this.button.width
        const fieldColor =  this.inputOptions.fieldColor || 0xffffff

        this.inputGraphic = new Graphix()
        this.inputGraphic.beginFill(fieldColor)
        this.inputGraphic.drawRect(0, 0, fieldWidth, 1)
        
        this.addChild(this.inputGraphic)

        if (this.inputOptions.showOnClick) {
            this.button.extendedOnTrigger = () => this.showInputField()
        }
    }

    showInputField() {

    }
}
