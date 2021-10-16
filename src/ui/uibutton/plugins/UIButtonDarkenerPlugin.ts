import { functionExists } from '../../../utils/Utils'
import { IUIButton } from '../UIButton'

export interface IUIButtonDarkenerPlugin {

}

export interface UIButtonDarkenerPluginOptions {
    shouldDarken: boolean
    hoverTint?: number
    clickTint?: number
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

        this.hoverTint = options.hoverTint ?? 0xdbdbdb
        this.clickTint = options.clickTint ?? 0x969696

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
        this.backgroundTint = this.hoverTint
        if (functionExists(this.buttonExtendedHover)) this.buttonExtendedHover()
    }

    onHold() {
        this.backgroundTint = this.clickTint
        if (functionExists(this.buttonExtendedOnHold)) this.buttonExtendedOnHold()
    }
    
    onMouseOut() {
        this.backgroundTint = 0xFFFFFF
        if (functionExists(this.buttonExtendedOnMouseOut)) this.buttonExtendedOnMouseOut()
    }

    onRelease() {
        this.backgroundTint = this.hoverTint
        if (functionExists(this.buttonExtendedOnRelease)) this.buttonExtendedOnRelease()
    }

    get backgroundSprite() {
        return this.button.background.backgroundSprite
    }

    set backgroundTint(value: number) {
        const backgrounds = this.button.background.allBackgrounds

        for (var i in backgrounds) {
            const bg = backgrounds[i]
            if (bg) {
                bg.tint = value
            }
        }
    }
}
