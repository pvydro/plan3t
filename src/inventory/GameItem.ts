export interface IGameItem {
    slotNumber: number
    weight: number
}

export interface GameItemOptions {
    slotNumber: number
    weight: number
}

export class GameItem implements IGameItem {
    slotNumber: number
    weight: number

    constructor(options: GameItemOptions) {
        this.slotNumber = options.slotNumber
        this.weight = options.weight
    }
}
