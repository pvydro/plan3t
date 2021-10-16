import { Key } from 'ts-keycode-enum'
import { SmallBlastParticle } from '../../engine/display/particle/SmallBlastParticle'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { GameStateManager } from '../../manager/gamestatemanager/GameStateManager'
import { ParticleManager } from '../../manager/particlemanager/ParticleManager'
import { Flogger } from '../../service/Flogger'
import { DebugConstants } from '../../utils/Constants'
import { HealthController, IHealthController } from '../gravityorganism/HealthController'
import { IClientPlayer } from './ClientPlayer'
import { PlayerConsciousnessState } from './ClientPlayerState'

export interface IPlayerHealthController extends IHealthController {

}

export interface PlayerHealthControllerOptions {
    player: IClientPlayer
}

export class PlayerHealthController extends HealthController implements IPlayerHealthController {
    player: IClientPlayer

    totalHealth: number = 100
    currentHealth: number = 100

    constructor(options: PlayerHealthControllerOptions) {
        super({
            totalHealth: 100
        })

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

        this.displayDamageEffects(damageAmount)

        if (DebugConstants.SuperMan) return

        super.takeDamage(damageAmount)
    }

    die() {
        Flogger.log('PlayerHealthController', 'die')
        super.die()

        this.player.consciousnessState = PlayerConsciousnessState.Dead
        this.displayDeathEffects()

        GameStateManager.getInstance().gameOver()
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

        particleManager.addParticle(new SmallBlastParticle({
            position: { x: this.player.x, y: this.player.y }
        }))
    }
}
