import { IClientEntity, ClientEntity } from '../cliententity/ClientEntity'

export interface IClientPlayer extends IClientEntity {
    
}

export class ClientPlayer extends ClientEntity {
    constructor() {
        super()
    }
}
