import { IEntityManager } from '../manager/EntityManager'
import { IRoomManager } from '../manager/RoomManager'
import { BasicLerp } from '../utils/Constants'

export interface IGameLoop {
    startGameLoop(): void
}

export interface GameLoopOptions {
    entityManager: IEntityManager
    roomManager: IRoomManager
}

export class GameLoop implements IGameLoop {
    _shouldLoop: boolean = true
    entityManager: IEntityManager
    roomManager: IRoomManager

    constructor(options: GameLoopOptions) {
        this.entityManager = options.entityManager
        this.roomManager = options.roomManager
    }

    startGameLoop() {
        this._shouldLoop = true
        requestAnimationFrame(this.gameLoop.bind(this))
    }

    stopGameLoop() {
        this._shouldLoop = false
    }

    gameLoop() {
        const entities = this.entityManager.entities
        const currentRoom = this.roomManager.currentRoom

        for (let id in entities) {
            entities[id].x = BasicLerp(entities[id].x, currentRoom.state.entities[id].x, 0.2)
            entities[id].y = BasicLerp(entities[id].y, currentRoom.state.entities[id].y, 0.2)
            
        }

        if (this._shouldLoop) {
            requestAnimationFrame(this.gameLoop.bind(this))
        }
    }
}