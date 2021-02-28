import { IInventoryItem, InventoryItem } from "./InventoryItem"

export interface IInventory {
    maximumWeight: number
}

export interface InventoryOptions {
    maximumWeight: number
}

export class Inventory implements IInventory {
    _maximumWeight: number
    items: Map<number, IInventoryItem> = new Map()

    constructor(options: InventoryOptions) {
        // this._totalSlots = options.totalSlots
        // this._maxItemsPerSlot = options.maxItemsPerSlot ?? 99
        this._maximumWeight = options.maximumWeight ?? 64
    }

    getItemById(id: number) {
        return this.items.get(id)
    }

    get maximumWeight() {
        return this._maximumWeight
    }

}
