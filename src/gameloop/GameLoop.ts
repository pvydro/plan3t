import * as PIXI from 'pixi.js'
import { ClientManager, IClientManager } from '../manager/ClientManager'
import { IEntityManager, LocalEntity } from '../manager/entitymanager/EntityManager'
import { GravityManager, IGravityManager } from '../manager/GravityManager'
import { IParticleManager, ParticleManager } from '../manager/particlemanager/ParticleManager'
import { IRoomManager } from '../manager/roommanager/RoomManager'
import { TooltipManager } from '../manager/TooltipManager'
import { Flogger } from '../service/Flogger'
import { exists } from '../utils/Utils'

export interface IGameLoop {
    startGameLoop(): void
    stopGameLoop(): void
}

export interface GameLoopOptions {
    clientManager?: IClientManager
    roomManager?: IRoomManager
    gravityManager?: IGravityManager
}

export class GameLoop implements IGameLoop {
    static Delta: number = 1
    _initialized: boolean = false
    _shouldLoop: boolean = true
    clientManager?: IClientManager
    particleManager?: ParticleManager
    tooltipManager?: TooltipManager
    entityManager?: IEntityManager
    gravityManager: IGravityManager
    roomManager?: IRoomManager

    constructor(options: GameLoopOptions) {
        this.assignOptions(options)

        this.particleManager = ParticleManager.getInstance()
        this.tooltipManager = TooltipManager.getInstance()
    }

    startGameLoop(options?: GameLoopOptions) {
        Flogger.log('GameLoop', 'startGameLoop')

        this.assignOptions(options)

        this._shouldLoop = true
        requestAnimationFrame(this.gameLoop.bind(this))
    }

    stopGameLoop() {
        Flogger.log('GameLoop', 'stopGameLoop')

        this._shouldLoop = false
    }

    gameLoop() {
        GameLoop.Delta = PIXI.Ticker.shared.deltaTime

        // Update all ClientEntities
        if (this.entityManager && this.gravityManager) {
            this.entityManager.clientEntities.forEach((localEntity: LocalEntity) => {
                const clientEntity = localEntity.clientEntity

                if (exists(clientEntity)) {
                    if (typeof clientEntity.update === 'function') {
                        clientEntity.update()
                    }
                    
                    // Check x + xVel for entity if colliding or in path colliding via CollisionManager B)
                    this.gravityManager.applyVelocityToEntity(clientEntity)
                }
            })
        }

        // Update camera & client manager
        if (this.clientManager !== undefined) {
            this.clientManager.clientCamera.update()
        }

        // Update current state
        this.clientManager.update()
        this.particleManager.update()
        this.tooltipManager.update()

        if (this._shouldLoop) {
            requestAnimationFrame(this.gameLoop.bind(this))
        }
    }

    assignOptions(options: GameLoopOptions) {
        if (options !== undefined) {
            this.gravityManager = options.gravityManager ?? this.gravityManager
            this.clientManager = options.clientManager ?? this.clientManager
            this.entityManager = this.clientManager.entityManager ?? this.entityManager
            this.roomManager = options.roomManager ?? this.roomManager
        }
    }
}
