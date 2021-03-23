import { AssetUrls } from '../../asset/Assets'
import { Graphix } from '../../engine/display/Graphix'
import { UIButton, UIButtonGraphicOptions, UIButtonOptions } from './UIButton'

export interface IUIHoloButton {

}

export interface IUIHoloButtonOptions extends UIButtonOptions {

}

export class UIHoloButton extends UIButton implements IUIHoloButton {
    backgroundGraphics: Graphix

    constructor(options?: IUIHoloButtonOptions) {
        options.background = {
            idle: AssetUrls.HOLO_BUTTON_BG
        }
        super(options)
    }
}
