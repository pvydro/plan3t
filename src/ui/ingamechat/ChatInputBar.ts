import { Graphix } from '../../engine/display/Graphix'
import { Tween } from '../../engine/display/tween/Tween'
import { log } from '../../service/Flogger'
import { UIDefaults } from '../../utils/Defaults'
import { IUIComponent, UIComponent } from '../UIComponent'

export interface IChatInputBar extends IUIComponent {
    enableFocus(shouldEnable: boolean): void
}

export class ChatInputBar extends UIComponent implements IChatInputBar {
    borderGraphics: Graphix
    focusedAlpha: number = 0.75
    unfocusedAlpha: number = 0.125

    constructor() {
        super({
            height: 8,
            width: UIDefaults.ChatboxDimensions.width
        })

        this.borderGraphics = this.createBorder()
        this.alpha = this.unfocusedAlpha

        this.addChild(this.borderGraphics)

    }

    enableFocus(shouldEnable: boolean) {
        log('ChatInputBar', 'enableFocus', 'shouldEnable', shouldEnable)

        if (shouldEnable) {
            Tween.to(this, {
                alpha: this.focusedAlpha, autoplay: true, duration: 0.5
            })
        } else {
            Tween.to(this, {
                alpha: this.unfocusedAlpha, autoplay: true, duration: 0.5
            })
        }
    }

    createBorder(): Graphix {
        const g = new Graphix()

        g.beginFill(0xFFFFFF)
        g.drawRect(0, this.height - 1, this.width, 1)
        g.endFill()

        return g
    }
}
