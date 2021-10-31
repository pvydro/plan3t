import { IGravityEntity } from '../cliententity/GravityEntity'
import { IGravityOrganism } from '../cliententity/gravityorganism/GravityOrganism'
import { IVector2 } from '../engine/math/Vector2'
import { AIAction } from './AIAction'
import { AIMessenger, IAIMessenger } from './AIMessenger'

export interface AINode extends IVector2 {

}

export interface IAI {
    target: IGravityEntity
    initialize(): void
    die(): void
    requestAction(action: AIAction): void
}

export interface AIOptions {
    gravityOrganism: IGravityOrganism
}

export abstract class AI implements IAI {
    _gravityOrganism: IGravityOrganism
    _isDead: boolean
    messenger: IAIMessenger

    constructor(options: AIOptions) {
        this._gravityOrganism = options.gravityOrganism
        this.messenger = new AIMessenger(this)
    }

    protected delegateActions() {
        
    }

    initialize() {

    }

    requestAction(action: AIAction) {
        this.messenger.requestAction(action)
    }

    die() {
        this._isDead = true
    }

    get target() {
        return this._gravityOrganism
    }

    get isDead() {
        return this._isDead
    }
}
