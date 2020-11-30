import { Entity } from '../../network/rooms/Entity'
import { IClientEntity, ClientEntity } from '../ClientEntity'
import { IPlayerHead, PlayerHead } from './PlayerHead'

export interface IClientPlayer extends IClientEntity {
    
}

export class ClientPlayer extends ClientEntity {
    head: IPlayerHead

    constructor(entity: Entity) {
        super()

        const head = new PlayerHead({ player: this })
        this.head = head
        this.addChild(head)
    }
}
