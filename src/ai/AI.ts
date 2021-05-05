import { IGravityEntity } from '../cliententity/GravityEntity'
import { IGravityOrganism } from '../cliententity/gravityorganism/GravityOrganism'
import { IVector2 } from '../engine/math/Vector2'

export interface AINode extends IVector2 {

}

export interface IAI {
    target: IGravityEntity
    initialize(): void
}

export interface AIOptions {
    gravityOrganism: IGravityOrganism
}

export abstract class AI implements IAI {
    _gravityOrganism: IGravityOrganism

    constructor(options: AIOptions) {
        this._gravityOrganism = options.gravityOrganism
    }

    initialize() {

    }

    get target() {
        return this._gravityOrganism
    }
}
