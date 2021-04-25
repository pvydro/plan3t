import { IUIScreen, UIScreen } from '../uiscreens/UIScreen'

export interface ILoadingScreen extends IUIScreen {

}

export class LoadingScreen extends UIScreen {
    private static Instance: LoadingScreen

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
    }
}
