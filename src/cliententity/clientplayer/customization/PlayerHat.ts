import { PlayerHatType } from '../../../model/PlayerCustomizationTypes'
import { ClientEntity, IClientEntity } from '../../ClientEntity'

export interface IPlayerHat extends IClientEntity {

}

export class PlayerHat extends ClientEntity implements IPlayerHat {
    constructor(type: PlayerHatType) {
        super({

        })
    }
}
