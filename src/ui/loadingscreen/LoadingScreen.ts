import { IUIScreen, UIScreen } from '../uiscreens/UIScreen'
import { LoadingIcon } from './LoadingIcon'

export interface ILoadingScreen extends IUIScreen {

}

export class LoadingScreen extends UIScreen {
    private static Instance: LoadingScreen

    loadingIcon: LoadingIcon

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

        this.loadingIcon = new LoadingIcon()
        
        this.addChild(this.loadingIcon)
        this.reposition(true)
        this.applyScale()
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
