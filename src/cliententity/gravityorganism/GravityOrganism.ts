import { Events } from '../../model/events/Events'
import { log } from '../../service/Flogger'
import { Bullet } from '../../weapon/projectile/Bullet'
import { GravityEntity, GravityEntityOptions, IGravityEntity } from '../GravityEntity'
import { HealthController, IHealthController } from './HealthController'

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
    organismState: GravityOrganismState = GravityOrganismState.Alive

    constructor(options?: GravityOrganismOptions) {
        super(options)

        const totalHealth = options.totalHealth ?? 50

        this.jumpHeight = options.jumpHeight ?? 3.5
        this.healthController = new HealthController({ totalHealth })
        this.healthController.on(Events.Death, () => {
            this.die()
        })
    }

    jump(jumpHeight?: number) {
        if (!this.isOnGround) return
        const jh = jumpHeight ?? this.jumpHeight

        this.onGround = false
        this.yVel = -jumpHeight
    }

    takeDamage(damage: number | Bullet) {
        log('GravityOrganism', 'takeDamage', 'damageAmount')
        
        let dmg = damage as number
        
        if (damage instanceof Bullet) {
            const bullet = damage as Bullet
            
            dmg = bullet.damage
        }
        
        this.healthController.takeDamage(dmg)
    }

    async die() {
        log('GravityOrganism', 'die')

        this.organismState = GravityOrganismState.Dead
    }

    get isDead() {
        return (this.organismState === GravityOrganismState.Dead)
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
}
