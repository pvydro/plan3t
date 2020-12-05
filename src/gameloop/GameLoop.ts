import { ClientEntity, IClientEntity } from '../cliententity/ClientEntity'
import { IClientManager } from '../manager/ClientManager'
import { IEntityManager } from '../manager/EntityManager'
import { IRoomManager } from '../manager/RoomManager'
import { BasicLerp } from '../utils/Constants'

export interface IGameLoop {
    startGameLoop(): void
    stopGameLoop(): void
}

export interface GameLoopOptions {
    clientManager: IClientManager
    roomManager: IRoomManager
}

export class GameLoop implements IGameLoop {
    _shouldLoop: boolean = true
    clientManager: IClientManager
    entityManager: IEntityManager
    roomManager: IRoomManager

    constructor(options: GameLoopOptions) {
        this.clientManager = options.clientManager
        this.entityManager = options.clientManager.entityManager
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
        // Update all ClientEntities
        const entitiesMap = this.entityManager.clientEntities
        let entities: ClientEntity[] = []
        for (let id in entitiesMap) {
            entities.push(entitiesMap[id])
        }
        entities.forEach((entity: ClientEntity) => {
            entity.update()
            entity.x += entity.xVel
            entity.y += entity.yVel
        })

        // Update camera
        this.clientManager.clientCamera.update()

        // Bring entities to server instance values
        // for (let id in entities) {
        //     entities[id].x = BasicLerp(entities[id].x, currentRoom.state.entities[id].x, 0.2)
        //     entities[id].y = BasicLerp(entities[id].y, currentRoom.state.entities[id].y, 0.2)
        // }

        if (this._shouldLoop) {
            requestAnimationFrame(this.gameLoop.bind(this))
        }
    }
}