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
    currentHealth: number
    totalHealth: number
    healthPercentage: number
    organismState: GravityOrganismState
    isDead: boolean
    jump(): void
    takeDamage(damage: number | Bullet): void
}

export interface GravityOrganismOptions extends GravityEntityOptions {
    totalHealth?: number
    jumpHeight?: number
}

export enum GravityOrganismState {
    Alive = 'Alive',
    Dead = 'Dead'
}

export class GravityOrganism extends GravityEntity implements IGravityOrganism {
    healthController: IHealthController
    jumpHeight: number
    _organismState: GravityOrganismState = GravityOrganismState.Alive
    _isDead: boolean = false

    constructor(options?: GravityOrganismOptions) {
        super(options)

        const totalHealth = options.totalHealth ?? 50

        this.jumpHeight = options.jumpHeight ?? 3.5
        this.healthController = new HealthController({ totalHealth })
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

    takeDamage(damage: number | Bullet) {
        log('GravityOrganism', 'takeDamage', 'damageAmount')

        if (this.isDead) return
        
        let dmg = damage as number
        
        if (damage instanceof Bullet) {
            const bullet = damage as Bullet
            
            dmg = bullet.damage
        }
        
        this.healthController.takeDamage(dmg)
    }

    async die() {
        log('GravityOrganism', 'die')

        this._isDead = true
        this.organismState = GravityOrganismState.Dead
        this.emit(GravityOrganismEvents.Dead)
    }

    get isDead() {
        return this._isDead
    }
    
    get currentHealth() {
        return this.healthController.currentHealth
    }

    get totalHealth() {
        return this.healthController.totalHealth
    }

    get healthPercentage() {
        return this.currentHealth / this.totalHealth
    }

    set organismState(value: GravityOrganismState) {
        this._organismState = value
    }

    get organismState() {
        return this._organismState
    }
}
