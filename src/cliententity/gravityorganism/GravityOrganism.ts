import { Events } from '../../model/events/Events'
import { log } from '../../service/Flogger'
import { Bullet } from '../../weapon/projectile/Bullet'
import { GravityEntity, GravityEntityOptions, IGravityEntity } from '../GravityEntity'
import { HealthController, IHealthController } from './HealthController'

export interface IGravityOrganism extends IGravityEntity {
    currentHealth: number
    totalHealth: number
    healthPercentage: number
    jump(): void
    takeDamage(damageAmount: number | Bullet): void
}

export interface GravityOrganismOptions extends GravityEntityOptions {
    totalHealth?: number
    jumpHeight?: number
}

export class GravityOrganism extends GravityEntity implements IGravityOrganism {
    healthController: IHealthController
    jumpHeight: number

    constructor(options?: GravityOrganismOptions) {
        super(options)

        const totalHealth = options.totalHealth ?? 50

        this.jumpHeight = options.jumpHeight ?? 3.5
        this.healthController = new HealthController({ totalHealth })
        this.healthController.on(Events.Death, () => {
            this.die()
        })
    }

    jump() {
        if (!this.isOnGround) return

        this.onGround = false
        this.yVel = -this.jumpHeight
    }

    takeDamage(damageAmount: number | Bullet) {
        log('GravityOrganism', 'takeDamage', 'damageAmount')
        
        let dmg = damageAmount as number
        
        if (damageAmount instanceof Bullet) {
            const bullet = damageAmount as Bullet
            
            dmg = bullet.damage
        }
        
        this.healthController.takeDamage(dmg)
    }

    die() {
        log('GravityOrganism', 'die')
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
