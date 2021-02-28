import { IGameItem, GameItem } from './GameItem'

export interface IInventory {
    maximumWeight?: number
    maximumSlots?: number
    getItemById(id: number): IGameItem
    transferToInventory(slotId: number, targetSlotId: number, targetInventory: IInventory): void
    addToInventory(slotId: number, item: IGameItem)
}

export interface InventoryOptions {
    maximumWeight?: number
    maximumSlots?: number
}

export class Inventory implements IInventory {
    _maximumWeight?: number = undefined
    _maximumSlots?: number = undefined
    items: Map<number, IGameItem> = new Map()

    constructor(options: InventoryOptions) {
        // this._totalSlots = options.totalSlots
        // this._maxItemsPerSlot = options.maxItemsPerSlot ?? 99
        this._maximumWeight = options.maximumWeight ?? undefined
        this._maximumSlots = options.maximumSlots ?? undefined
    }

    transferToInventory(slotId: number, targetSlotId: number, targetInventory: IInventory) {
        const transferItem = this.getItemById(slotId)

        this.items.delete(slotId)

        // Swap items if other inventory has an item in targetSlotId
        if (targetInventory.getItemById(targetSlotId) !== undefined) {
            targetInventory.transferToInventory(targetSlotId, slotId, this)
        }

        // Apply new item to slot
        targetInventory.addToInventory(targetSlotId, transferItem)
    }

    addToInventory(slotId: number, item: IGameItem) {
        if (this.items.get(slotId)) {
            // TODO: Drop this
        }

        this.items.set(slotId, item)
    }

    getItemById(id: number) {
        return this.items.get(id)
    }

    get maximumWeight() {
        return this._maximumWeight
    }
}
