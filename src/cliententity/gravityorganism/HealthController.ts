import { Events } from '../../model/events/Events'
import { log } from '../../service/Flogger'
import { Emitter, IEmitter } from '../../utils/Emitter'

export interface IHealthController extends IEmitter {
    totalHealth: number
    currentHealth: number
    isDead: boolean
    takeDamage(damageAmount: number): void
    suicide(): void
    resetHealth(): void
}

export interface HealthControllerOptions {
    totalHealth: number
}

export class HealthController extends Emitter implements IHealthController {
    totalHealth: number
    currentHealth: number
    isDead: boolean = false

    constructor(options: HealthControllerOptions) {
        super()

        if (options.totalHealth) {
            this.totalHealth = (options && options.totalHealth) ?? 100
            this.currentHealth = options.totalHealth
        }
    }

    takeDamage(damageAmount: number): void {
        if (this.isDead) return
        
        log('HealthController', 'takeDamage', 'damageAmount', damageAmount)

        this.currentHealth -= damageAmount
        this.checkDeath()
    }

    suicide(): void {
        log('HealthController', 'suicide')

        this.takeDamage(this.totalHealth)
    }

    resetHealth(): void {
        this.isDead = false

        this.currentHealth = this.totalHealth
    }

    protected die() {
        log('HealthController', 'die')

        this.isDead = true

        this.emit(Events.Death)
    }

    private checkDeath() {
        if (!this.isDead && this.currentHealth <= 0) {
            this.currentHealth = 0

            this.die()
        }
    }
}
