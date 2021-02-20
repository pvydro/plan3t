import { functionExists } from "../../utils/Utils";
import { IUIButton, UIButton } from "./UIButton";

export interface IUIButtonDarkenerPlugin {

}

export interface UIButtonDarkenPluginOptions {
    hoverTint: number
    clickTint: number
}

export class UIButtonDarkenerPlugin implements IUIButtonDarkenerPlugin {
    buttonExtendedHover: Function
    buttonExtendedOnHold: Function
    buttonExtendedOnMouseOut: Function
    buttonExtendedOnRelease: Function
    button: UIButton

    hoverTint: number
    clickTint: number

    constructor(button: UIButton, options: UIButtonDarkenPluginOptions) {
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
        this.button.backgroundSprite.tint = this.hoverTint
        if (functionExists(this.buttonExtendedHover)) this.buttonExtendedHover()
    }

    onHold() {
        this.button.backgroundSprite.tint = this.clickTint
        if (functionExists(this.buttonExtendedOnHold)) this.buttonExtendedOnHold()
    }
    
    onMouseOut() {
        this.button.backgroundSprite.tint = 0xFFFFFF
        if (functionExists(this.buttonExtendedOnMouseOut)) this.buttonExtendedOnMouseOut()
    }

    onRelease() {
        this.button.backgroundSprite.tint = this.hoverTint
        if (functionExists(this.buttonExtendedOnRelease)) this.buttonExtendedOnRelease()
    }
}
