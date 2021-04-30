import { Events } from '../../model/events/Events'
import { log } from '../../service/Flogger'
import { GravityEntity, GravityEntityOptions, IGravityEntity } from '../GravityEntity'
import { HealthController, IHealthController } from './HealthController'

export interface IGravityOrganism extends IGravityEntity {
    currentHealth: number
    totalHealth: number
    healthPercentage: number
    takeDamage(damageAmount: number): void
}

export interface GravityOrganismOptions extends GravityEntityOptions {
    totalHealth?: number
}

export class GravityOrganism extends GravityEntity implements IGravityOrganism {
    healthController: IHealthController

    constructor(options?: GravityOrganismOptions) {
        super(options)

        const totalHealth = options.totalHealth ?? 50

        this.healthController = new HealthController({ totalHealth })
        this.healthController.on(Events.Death, () => {
            this.die()
        })
    }

    takeDamage(damageAmount: number) {
        log('GravityOrganism', 'takeDamage', 'damageAmount', damageAmount)

        this.healthController.takeDamage(damageAmount)
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
