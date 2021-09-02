import { IUIScreen, UIScreen } from '../UIScreen'

export interface IStyleScreen extends IUIScreen {

}

export class StyleScreen extends UIScreen implements IStyleScreen {
    constructor() {
        super({
            background: {
                useSharedBackground: true
            },
            header: {
                text: 'Style'
            }
        })

        this.applyScale()
        this.reposition(true)
    }

    update() {
        super.update()
    }

    applyScale() {
        const toScale = [

        ]

        super.applyScale(toScale)
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)
    }
}
