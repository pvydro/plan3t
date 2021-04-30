import { log } from '../../service/Flogger'

export interface IHealthController {
    totalHealth: number
    currentHealth: number
    takeDamage(damageAmount: number): void
    suicide(): void
    resetHealth(): void
}

export interface HealthControllerOptions {
    totalHealth: number
}

export class HealthController implements IHealthController {

    totalHealth: number = 100
    currentHealth: number = 100

    constructor(options: HealthControllerOptions) {

    }

    takeDamage(damageAmount: number): void {
        log('HealthController', 'takeDamage', 'damageAmount', damageAmount)

        this.currentHealth -= damageAmount

        this.checkDeath()
    }

    suicide(): void {
        log('HealthController', 'suicide')

        this.takeDamage(this.totalHealth)
    }

    resetHealth(): void {
        this.currentHealth = this.totalHealth
    }

    protected die() {
        log('HealthController', 'die')
    }

    private checkDeath() {
        if (this.currentHealth <= 0) {
            this.currentHealth = 0

            this.die()
        }
    }
}
