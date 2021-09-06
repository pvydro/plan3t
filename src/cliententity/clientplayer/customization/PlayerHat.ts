import { PlayerHatType } from '../../../model/PlayerCustomizationTypes'
import { IPlayerCustomizationPiece, PlayerCustomizationPiece } from './PlayerCustomizationPiece'

export interface IPlayerHat extends IPlayerCustomizationPiece {

}

export class PlayerHat extends PlayerCustomizationPiece implements IPlayerHat {
    constructor(type: PlayerHatType) {
        super()
    }
}
