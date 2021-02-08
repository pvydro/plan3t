import { ClientEntity, IClientEntity } from '../cliententity/ClientEntity'
import { IClientManager } from '../manager/ClientManager'
import { IEntityManager } from '../manager/EntityManager'
import { GravityManager, IGravityManager } from '../manager/GravityManager'
import { IRoomManager, RoomManager } from '../manager/roommanager/RoomManager'
import { Flogger } from '../service/Flogger'

export interface IGameLoop {
    startGameLoop(): void
    stopGameLoop(): void
}

export interface GameLoopOptions {
    clientManager?: IClientManager
    roomManager?: IRoomManager
}

export class GameLoop implements IGameLoop {
    _initialized: boolean = false
    _shouldLoop: boolean = true
    clientManager?: IClientManager = undefined
    entityManager?: IEntityManager = undefined
    gravityManager: IGravityManager = undefined
    roomManager?: IRoomManager = undefined

    constructor(options: GameLoopOptions) {
        this.assignOptions(options)

        this.gravityManager = GravityManager.getInstance()
    }

    startGameLoop(options?: GameLoopOptions) {
        this.assignOptions(options)

        this._shouldLoop = true
        requestAnimationFrame(this.gameLoop.bind(this))
    }

    stopGameLoop() {
        this._shouldLoop = false
    }

    gameLoop() {

        // Update all ClientEntities
        if (this.entityManager !== undefined) {
            const entitiesMap = this.entityManager.clientEntities
            let entities: ClientEntity[] = []
            for (let id in entitiesMap) {
                entities.push(entitiesMap[id])
            }
            entities.forEach((entity: ClientEntity) => {
                entity.update()
                
                // Check x + xVel for entity if colliding or in path colliding via CollisionManager B)
                this.gravityManager.applyVelocityToEntity(entity)
            })
        }

        // Update camera & client manager
        if (this.clientManager !== undefined) {
            this.clientManager.clientCamera.update()
        }

        // Update current state
        this.clientManager.gameStateManager.update()

        if (this._shouldLoop) {
            requestAnimationFrame(this.gameLoop.bind(this))
        }
    }

    assignOptions(options: GameLoopOptions) {
        if (options !== undefined) {
            this.clientManager = options.clientManager ?? this.clientManager
            this.entityManager = options.clientManager.entityManager ?? this.entityManager
            this.roomManager = options.roomManager ?? this.roomManager
        }
    }
}