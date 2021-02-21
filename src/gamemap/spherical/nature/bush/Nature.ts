export interface INature {

}

export interface NatureOptions {
    interactive?: boolean
}

export class Nature implements INature {
    _interactive: boolean = false

    constructor(options: NatureOptions) {
        this._interactive = options.interactive ?? false
    }

    get interactive() {
        return this._interactive
    }

    set interactive(value: boolean) {
        this._interactive = value
    }
}
