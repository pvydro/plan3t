import { Container } from '../../../engine/display/Container'
import { UIContainerOptions } from '../../../ui/UIContainer'

export interface INature {

}

export interface NatureOptions extends UIContainerOptions {
    interactiveNature?: boolean
}

export class Nature extends Container implements INature {
    _interactiveNature: boolean = false

    constructor(options: NatureOptions) {
        super()

        this._interactiveNature = options.interactiveNature ?? false
    }

    get interactiveNature() {
        return this._interactiveNature
    }

    set interactiveNature(value: boolean) {
        this._interactiveNature = value
    }
}
