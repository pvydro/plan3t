import { AssetUrls } from '../../asset/Assets'
import { IUIButton, UIButton, UIButtonOptions, UIButtonType } from './UIButton'

export interface IUISquareButton extends IUIButton {
}

export class UISquareButton extends UIButton implements IUISquareButton {
    constructor(options?: UIButtonOptions) {
        options = UISquareButton.applyDefaults(options)

        super(options)
    }

    private static applyDefaults(options: UIButtonOptions): UIButtonOptions {
        options.type = options.type ?? UIButtonType.Tap
        options.background = {
            idle: AssetUrls.ButtonSquare
        }

        return options
    }
}
