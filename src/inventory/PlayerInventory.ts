import { IInventory, Inventory, InventoryOptions } from './Inventory'

export interface IPlayerInventory extends IInventory {

}

export interface PlayerInventoryOptions extends InventoryOptions {
    
}

export class PlayerInventory extends Inventory implements IPlayerInventory {
    hotbarInventory: IInventory
    bulletInventory: IInventory

    constructor(options: PlayerInventoryOptions) {
        super(options)
    }
}
