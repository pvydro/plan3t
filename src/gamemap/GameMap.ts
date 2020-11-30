export interface IGameMap {
    temporaryGroundLevel: number
}

export class GameMap implements IGameMap {
    temporaryGroundLevel = 0
    
    constructor() {

    }
}
