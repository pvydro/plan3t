import * as PIXI from 'pixi.js'
import { ClientEntity, IClientEntity } from '../cliententity/ClientEntity'
import { IClientManager } from '../manager/ClientManager'
import { IEntityManager } from '../manager/entitymanager/EntityManager'
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
    static Delta: number = 1
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
        GameLoop.Delta = PIXI.Ticker.shared.deltaTime

        // Update all ClientEntities
        if (this.entityManager !== undefined) {
            const entitiesMap = this.entityManager.clientEntities

            for (let i in entitiesMap) {
                const clientEntity = entitiesMap[i].clientEntity

                if (clientEntity !== undefined || clientEntity !== null) {
                    if (typeof clientEntity.update === 'function') {
                        clientEntity.update()

                        // Check x + xVel for entity if colliding or in path colliding via CollisionManager B)
                        this.gravityManager.applyVelocityToEntity(clientEntity)
                    }
                }
            }
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
