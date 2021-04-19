import { IPlayerInventory, PlayerInventory } from './PlayerInventory'

export interface IClientPlayerInventory extends IPlayerInventory {

}

export class ClientPlayerInventory extends PlayerInventory implements IClientPlayerInventory {
    private static Instance: ClientPlayerInventory

    static getInstance() {
        if (ClientPlayerInventory.Instance === undefined) {
            ClientPlayerInventory.Instance = new ClientPlayerInventory()
        }
    }

    private constructor() {
        super({
            maximumWeight: 64
        })
    }
}
