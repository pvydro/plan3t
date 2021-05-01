import { IGravityEntity } from '../cliententity/GravityEntity'
import { IVector2 } from '../engine/math/Vector2'

export interface AINode extends IVector2 {

}

export interface IAI {
    target: IGravityEntity
    initialize(): void
}

export interface AIOptions {
    gravityEntity: IGravityEntity
}

export abstract class AI implements IAI {
    _gravityEntity: IGravityEntity

    constructor(options: AIOptions) {
        this._gravityEntity = options.gravityEntity
    }

    initialize() {

    }

    get target() {
        return this._gravityEntity
    }
}
