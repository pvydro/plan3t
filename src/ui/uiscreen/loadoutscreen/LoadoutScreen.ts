import { IUIScreen, UIScreen } from '../UIScreen'

export interface ILoadoutScreen extends IUIScreen {

}

export class LoadoutScreen extends UIScreen implements ILoadoutScreen {
    constructor() {
        super({
            background: {
                useSharedBackground: true
            },
            header: {
                text: 'Loadout'
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
