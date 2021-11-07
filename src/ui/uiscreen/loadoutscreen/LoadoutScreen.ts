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
            },
            addBackButton: true
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
