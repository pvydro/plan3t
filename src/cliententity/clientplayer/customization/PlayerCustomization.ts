import { PlayerHairType } from '../../../model/PlayerCustomizationTypes'
import { log } from '../../../service/Flogger'
import { IClientPlayer } from '../ClientPlayer'
import { PlayerHairFactory } from './helper/PlayerHairFactory'
import { IPlayerHair, PlayerHair, PlayerHairColor } from './PlayerHair'

export interface IPlayerCustomization extends PlayerCustomizationPieces {
    apply(config: PlayerCustomizationConfig)
}

export interface PlayerCustomizationOptions {
    player: IClientPlayer
}

export interface PlayerCustomizationConfig {
    hair?: PlayerHairType
    hairColor?: PlayerHairColor
}

interface PlayerCustomizationPieces {
    hair?: PlayerHair
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
            this.hair = new PlayerHair(config.hair, config.hairColor)
        }

        this.attachPiecesToBodyParts(this)
    }

    unapply() {
        this.configApplied = false
    }

    attachPiecesToBodyParts(pieces: PlayerCustomizationPieces) {
        if (pieces.hair) {
            this.player.getPlayerHead().setHair(pieces.hair)
        }
    }
}
