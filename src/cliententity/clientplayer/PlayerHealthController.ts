import { Key } from "ts-keycode-enum";
import { InputProcessor } from "../../input/InputProcessor";
import { Flogger } from "../../service/Flogger";
import { IClientPlayer } from "./ClientPlayer";

export interface IPlayerHealthController {
    totalHealth: number
    currentHealth: number
    takeDamage(damageAmount: number): void
    suicide(): void
}

export interface PlayerHealthControllerOptions {
    player: IClientPlayer
}

export class PlayerHealthController implements IPlayerHealthController {
    player: IClientPlayer

    totalHealth: number = 100
    currentHealth: number = 100

    constructor(options: PlayerHealthControllerOptions) {
        this.player = options.player

        this.addTestKeyListeners()
    }

    addTestKeyListeners() {
        InputProcessor.on('keydown', (ev: KeyboardEvent) => {
            switch (ev.which) {
                case Key.P:
                    this.takeDamage(10)
                    break
            }
        })
    }

    takeDamage(damageAmount: number): void {
        Flogger.log('PlayerHealthController', 'takeDamage', 'damageAmount', damageAmount)

        this.currentHealth -= damageAmount

        this.checkDeath()
    }

    suicide(): void {
        Flogger.log('PlayerHealthController', 'suicide')

        this.currentHealth -= this.totalHealth
        this.checkDeath()
    }

    private checkDeath() {
        if (this.currentHealth <= 0) {
            this.currentHealth = 0

            this.die()
        }
    }

    private die() {
        Flogger.log('PlayerHealthController', 'die')
    }
}
