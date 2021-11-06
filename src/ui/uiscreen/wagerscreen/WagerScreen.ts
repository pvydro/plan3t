import { IUIScreen, UIScreen } from '../UIScreen'

export interface IWagerScreen extends IUIScreen {

}

export class WagerScreen extends UIScreen implements IWagerScreen {
    constructor() {
        super({
            header: {
                text: 'Wager'
            },
            background: {
                useSharedBackground: true
            }
        })

        this.applyScale()
        this.reposition(true)
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)
    }
}
