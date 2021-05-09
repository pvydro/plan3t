import { Graphix } from '../../engine/display/Graphix'
import { log } from '../../service/Flogger'
import { GameWindow } from '../../utils/Constants'
import { Defaults } from '../../utils/Defaults'
import { IUIScreen, UIScreen } from '../uiscreens/UIScreen'
import { LoadingIcon } from './LoadingIcon'
import { ILoadingScreenAnimator, LoadingScreenAnimator } from './LoadingScreenAnimator'

export interface ILoadingScreen extends IUIScreen {
    backgroundGraphic: Graphix
}

export class LoadingScreen extends UIScreen implements ILoadingScreen {
    private static Instance: LoadingScreen
    backgroundGraphic: Graphix
    loadingIcon: LoadingIcon
    animator: ILoadingScreenAnimator

    static getInstance() {
        if (!this.Instance) {
            this.Instance = new LoadingScreen()
        }

        return this.Instance
    }

    private constructor() {
        super({
            background: { backgroundColor: 0x101010 }
        })

        this.animator = new LoadingScreenAnimator({ screen: this })
        this.loadingIcon = new LoadingIcon()
        
        this.addChild(this.loadingIcon)
        this.applyScale()
        this.reposition(true)
    }

    async show() {
        log('LoadingScreen', 'show')

        return this.animator.show(true)
    }

    async hide() {
        log('LoadingScreen', 'hide')

        return this.animator.show(false)
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        const loadingTextHeight = (this.loadingIcon && this.loadingIcon.textHeight) ?? 0
        const x = Defaults.UIEdgePadding
        const y = GameWindow.y + GameWindow.height - Defaults.UIEdgePadding - (loadingTextHeight)
        
        if (this.loadingIcon) {
            this.loadingIcon.pos = { x, y }
        }
    }

    applyScale() {
        const toScale = [
            this.loadingIcon
        ]

        super.applyScale(toScale)
    }
}
