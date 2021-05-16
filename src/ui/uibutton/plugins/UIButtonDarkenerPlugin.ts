import { functionExists } from '../../../utils/Utils'
import { IUIButton } from '../UIButton'

export interface IUIButtonDarkenerPlugin {

}

export interface UIButtonDarkenerPluginOptions {
    hoverTint: number
    clickTint: number
}

export class UIButtonDarkenerPlugin implements IUIButtonDarkenerPlugin {
    buttonExtendedHover: Function
    buttonExtendedOnHold: Function
    buttonExtendedOnMouseOut: Function
    buttonExtendedOnRelease: Function
    button: IUIButton

    hoverTint: number
    clickTint: number

    constructor(button: IUIButton, options: UIButtonDarkenerPluginOptions) {
        this.button = button

        this.hoverTint = options.hoverTint
        this.clickTint = options.clickTint

        this.buttonExtendedHover = this.button.extendedOnHover
        this.buttonExtendedOnHold = this.button.extendedOnHold
        this.buttonExtendedOnMouseOut = this.button.extendedOnMouseOut
        this.buttonExtendedOnRelease = this.button.extendedOnRelease

        this.button.extendedOnHover = () => { this.onHover() }        
        this.button.extendedOnHold = () => { this.onHold() }
        this.button.extendedOnMouseOut = () => { this.onMouseOut() }
        this.button.extendedOnRelease = () => { this.onRelease() }
    }

    onHover() {
        this.backgroundSprite.tint = this.hoverTint
        if (functionExists(this.buttonExtendedHover)) this.buttonExtendedHover()
    }

    onHold() {
        this.backgroundSprite.tint = this.clickTint
        if (functionExists(this.buttonExtendedOnHold)) this.buttonExtendedOnHold()
    }
    
    onMouseOut() {
        this.backgroundSprite.tint = 0xFFFFFF
        if (functionExists(this.buttonExtendedOnMouseOut)) this.buttonExtendedOnMouseOut()
    }

    onRelease() {
        this.backgroundSprite.tint = this.hoverTint
        if (functionExists(this.buttonExtendedOnRelease)) this.buttonExtendedOnRelease()
    }

    get backgroundSprite() {
        return this.button.background.backgroundSprite
    }
}
