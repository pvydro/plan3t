import { Graphix } from '../../engine/display/Graphix'
import { log } from '../../service/Flogger'
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
            background: {
                backgroundColor: 0x1e1e1e
            }
        })

        this.animator = new LoadingScreenAnimator({ screen: this })
        this.loadingIcon = new LoadingIcon()
        
        this.addChild(this.loadingIcon)
        this.reposition(true)
        this.applyScale()
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

        this.loadingIcon.pos = {
            x: 150,
            y: 150
        }
    }

    applyScale() {
        const toScale = [
            this.loadingIcon
        ]

        super.applyScale(toScale)
    }
}
