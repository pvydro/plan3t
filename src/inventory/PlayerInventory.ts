import { IInventory, Inventory, InventoryOptions } from './Inventory'

export interface IPlayerInventory extends IInventory {
    hotbarInventory: IInventory
    bulletInventory: IInventory
}

export interface PlayerInventoryOptions extends InventoryOptions {
    
}

export class PlayerInventory extends Inventory implements IPlayerInventory {
    hotbarInventory: IInventory
    bulletInventory: IInventory

    constructor(options: PlayerInventoryOptions) {
        super(options)

        this.hotbarInventory = new Inventory({
            maximumSlots: 8
        })
        this.bulletInventory = new Inventory({
            maximumWeight: 64
        })
    }
}
