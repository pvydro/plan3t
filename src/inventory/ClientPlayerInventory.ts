import { IInventory, Inventory } from './Inventory'

export interface IClientPlayerInventory extends IInventory {

}

export class ClientPlayerInventory extends Inventory implements IClientPlayerInventory {
    private static INSTANCE: ClientPlayerInventory
    
    hotbarInventory: IInventory

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
