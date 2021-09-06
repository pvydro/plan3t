import { PlayerHairType } from '../../../model/PlayerCustomizationTypes'
import { log } from '../../../service/Flogger'
import { IClientPlayer } from '../ClientPlayer'
import { PlayerHairFactory } from './helper/PlayerHairFactory'
import { IPlayerHair, PlayerHair } from './PlayerHair'

export interface IPlayerCustomization extends PlayerCustomizationPieces {

}

export interface PlayerCustomizationOptions {
    player: IClientPlayer
}

export interface PlayerCustomizationConfig {
    hair?: PlayerHairType
}

interface PlayerCustomizationPieces {
    hair?: IPlayerHair
}

export class PlayerCustomization implements IPlayerCustomization {
    configApplied: boolean = false
    hair?: PlayerHair
    player: IClientPlayer

    constructor(options: PlayerCustomizationOptions) {
        this.player = options.player
    }

    apply(config: PlayerCustomizationConfig) {
        log('PlayerCustomization', 'applyCustomization', config)
        
        if (this.configApplied) this.unapply()
        this.configApplied = true

        if (config.hair) {
            this.hair = new PlayerHair(config.hair) // PlayerHairFactory.createHairForType(config.hair)
        }

        this.attachPiecesToBodyParts(this)
    }

    unapply() {
        this.configApplied = false
    }

    attachPiecesToBodyParts(pieces: PlayerCustomizationPieces) {
        if (pieces.hair) {
            // this.player.getPlayerHead().
        }
    }
}
