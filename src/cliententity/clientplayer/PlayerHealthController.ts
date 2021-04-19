import { Key } from 'ts-keycode-enum'
import { SmallBlastParticle } from '../../engine/display/particle/SmallBlastParticle'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { ParticleManager } from '../../manager/particlemanager/ParticleManager'
import { Flogger } from '../../service/Flogger'
import { InGameHUD } from '../../ui/ingamehud/InGameHUD'
import { InGameScreenID } from '../../ui/ingamemenu/InGameMenu'
import { IClientPlayer, PlayerConsciousnessState } from './ClientPlayer'

export interface IPlayerHealthController {
    totalHealth: number
    currentHealth: number
    takeDamage(damageAmount: number): void
    suicide(): void
    resetHealth(): void
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

        if (this.player.isClientPlayer) this.addTestKeyListeners()
    }

    addTestKeyListeners() {
        InputProcessor.on(InputEvents.KeyDown, (ev: KeyboardEvent) => {
            switch (ev.which) {
                case Key.P:
                    this.takeDamage(10)
                    break
                case Key.K:
                    this.suicide()
                    break
            }
        })
    }

    takeDamage(damageAmount: number): void {
        Flogger.log('PlayerHealthController', 'takeDamage', 'damageAmount', damageAmount)

        this.currentHealth -= damageAmount

        this.checkDeath()
        this.displayDamageEffects(damageAmount)
    }

    suicide(): void {
        Flogger.log('PlayerHealthController', 'suicide')

        this.takeDamage(this.totalHealth)
    }

    resetHealth(): void {
        this.currentHealth = this.totalHealth
    }

    private checkDeath() {
        if (this.currentHealth <= 0) {
            this.currentHealth = 0

            this.die()
        }
    }

    private die() {
        Flogger.log('PlayerHealthController', 'die')

        this.player.consciousnessState = PlayerConsciousnessState.Dead
        this.displayDeathEffects()
    }

    private displayDamageEffects(damageAmount: number) {
        const particleManager = ParticleManager.getInstance()
        const damageString = '-' + damageAmount
        
        particleManager.addTextParticle({
            text: damageString,
            position: { x: this.player.x, y: this.player.y },
            positionRandomization: { randomizationRange: 32 }
        })
    }

    private displayDeathEffects() {
        const particleManager = ParticleManager.getInstance()
        const hud = InGameHUD.getInstance()

        particleManager.addParticle(new SmallBlastParticle({
            position: { x: this.player.x, y: this.player.y }
        }))

        hud.requestMenuScreen(InGameScreenID.RespawnScreen)
    }
}
