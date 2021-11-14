import * as PIXI from 'pixi.js'
import { IClientManager } from '../manager/ClientManager'
import { IEntityManager, LocalEntity } from '../manager/entitymanager/EntityManager'
import { IGravityManager } from '../manager/GravityManager'
import { TooltipManager } from '../manager/TooltipManager'
import { Flogger } from '../service/Flogger'
import { camera, particleMan } from '../shared/Dependencies'
import { exists } from '../utils/Utils'

export interface IGameLoop {
    startGameLoop(): void
    stopGameLoop(): void
}

export interface GameLoopOptions {
    clientManager?: IClientManager
    gravityManager?: IGravityManager
}

export class GameLoop implements IGameLoop {
    static ShouldLoop: boolean = true
    static Delta: number = 1
    static CustomDelta: number = 1
    _initialized: boolean = false
    clientManager?: IClientManager
    tooltipManager?: TooltipManager
    entityManager?: IEntityManager
    gravityManager: IGravityManager

    constructor(options: GameLoopOptions) {
        this.assignOptions(options)

        this.tooltipManager = TooltipManager.getInstance()
    }

    startGameLoop(options?: GameLoopOptions) {
        Flogger.log('GameLoop', 'startGameLoop')
        GameLoop.ShouldLoop = true

        this.assignOptions(options)
        
        requestAnimationFrame(this.gameLoop.bind(this))
    }

    stopGameLoop() {
        Flogger.log('GameLoop', 'stopGameLoop')

        GameLoop.ShouldLoop = false
    }

    gameLoop() {
        GameLoop.Delta = (PIXI.Ticker.shared.deltaTime * GameLoop.CustomDelta)

        if (GameLoop.ShouldLoop) {
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

            camera.update()

            // Update current state
            this.clientManager.update()
            this.tooltipManager.update()
            particleMan.update()
        }

        requestAnimationFrame(this.gameLoop.bind(this))
    }

    assignOptions(options: GameLoopOptions) {
        if (options !== undefined) {
            this.gravityManager = options.gravityManager ?? this.gravityManager
            this.clientManager = options.clientManager ?? this.clientManager
            this.entityManager = this.clientManager.entityManager ?? this.entityManager
        }
    }
}
