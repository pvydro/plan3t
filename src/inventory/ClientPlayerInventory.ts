import { IPlayerInventory, PlayerInventory } from './PlayerInventory'

export interface IClientPlayerInventory extends IPlayerInventory {

}

export class ClientPlayerInventory extends PlayerInventory implements IClientPlayerInventory {
    private static INSTANCE: ClientPlayerInventory

    static getInstance() {
        if (ClientPlayerInventory.INSTANCE === undefined) {
            ClientPlayerInventory.INSTANCE = new ClientPlayerInventory()
        }
    }

    private constructor() {
        super({
            maximumWeight: 64
        })
    }
}
