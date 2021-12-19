import { Events } from '../../model/events/Events'
import { log } from '../../service/Flogger'
import { IEmitter } from '../../utils/Emitter'
import { Bullet } from '../../weapon/projectile/Bullet'
import { GravityEntity, GravityEntityOptions, IGravityEntity } from '../GravityEntity'
import { HealthController, IHealthController } from './HealthController'

export enum GravityOrganismEvents {
    Dead = 'Dead'
}

export interface IGravityOrganism extends IGravityEntity {
    organismState: GravityOrganismState
    jump(): void
}

export interface GravityOrganismOptions extends GravityEntityOptions {
    jumpHeight?: number
}

export enum GravityOrganismState {
    Alive = 'Alive',
    Dead = 'Dead'
}

export class GravityOrganism extends GravityEntity implements IGravityOrganism {
    jumpHeight: number
    _organismState: GravityOrganismState = GravityOrganismState.Alive

    constructor(options?: GravityOrganismOptions) {
        super(options)

        this.jumpHeight = options.jumpHeight ?? 3.5
        this.healthController.on(Events.Death, () => {
            this.die()
        })
    }

    jump(jumpHeight?: number, bypassOnGround: boolean = false) {
        if (!this.isOnGround && !bypassOnGround) return
        const jh = jumpHeight ?? this.jumpHeight

        this.onGround = false
        this.yVel = -jh
    }

    async die() {
        log('GravityOrganism', 'die')

        this._isDead = true
        this.organismState = GravityOrganismState.Dead
        this.emit(GravityOrganismEvents.Dead)
    }
    
    set organismState(value: GravityOrganismState) {
        this._organismState = value
    }

    get organismState() {
        return this._organismState
    }
}
