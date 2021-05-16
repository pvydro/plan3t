import { IVector2 } from '../../../engine/math/Vector2'
import { IUIButton } from '../UIButton'

export interface IUIButtonNudgePlugin {

}

export interface UIButtonNudgeOptions {
    xNudgeOnClick?: number
    yNudgeOnClick?: number
}

export class UIButtonNudgePlugin implements IUIButtonNudgePlugin {
    button: IUIButton
    nudgeOptions: UIButtonNudgeOptions
    originalButtonPosition?: IVector2

    constructor(button: IUIButton, options: UIButtonNudgeOptions) {
        this.button = button
        this.nudgeOptions = this.applyDefaults(options)

        button.extendedOnHold = () => {
            this.applyNudge()
        }

        button.extendedOnRelease = () => {
            this.releaseNudge()
        }
    }

    applyNudge() {
        if (!this.originalButtonPosition) {
            this.originalButtonPosition = { x: this.button.x, y: this.button.y }
        }

        // this.button.x = this.originalButtonPosition.x + this.nudgeX
        this.button.y = this.originalButtonPosition.y + this.nudgeY
    }

    releaseNudge() {
        // this.button.x = this.originalButtonPosition.x
        this.button.y = this.originalButtonPosition.y

        this.originalButtonPosition = undefined
    }

    private applyDefaults(options: UIButtonNudgeOptions) {
        options.xNudgeOnClick = options.xNudgeOnClick ?? 0
        options.yNudgeOnClick = options.yNudgeOnClick ?? 0

        return options
    }

    get nudgeX() {
        return this.nudgeOptions.xNudgeOnClick
    }

    get nudgeY() {
        return this.nudgeOptions.yNudgeOnClick
    }
}
