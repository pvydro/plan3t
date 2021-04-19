export interface IDimension {
    width: number
    height: number
}

export class Dimension implements IDimension {
    _width: number
    _height: number

    constructor(width: number, height: number) {
        this._width = width
        this._height = height
    }

    get width() {
        return this._width
    }

    get height() {
        return this._height
    }

    set width(value: number) {
        this._width = value
    }

    set height(value: number) {
        this._height = value
    }
}
