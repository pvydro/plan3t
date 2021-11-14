import * as PIXI from 'pixi.js'
import { LocalEntity } from '../manager/entitymanager/EntityManager'
import { IGravityManager } from '../manager/GravityManager'
import { TooltipManager } from '../manager/TooltipManager'
import { Flogger } from '../service/Flogger'
import { camera, entityMan, gameStateMan, particleMan } from '../shared/Dependencies'
import { exists } from '../utils/Utils'

export interface IGameLoop {
    startGameLoop(): void
    stopGameLoop(): void
}


export class GameLoop implements IGameLoop {
    static ShouldLoop: boolean = true
    static Delta: number = 1
    static CustomDelta: number = 1
    _initialized: boolean = false
    tooltipManager?: TooltipManager
    gravityManager: IGravityManager

    constructor() {
        this.tooltipManager = TooltipManager.getInstance()
    }

    startGameLoop() {
        Flogger.log('GameLoop', 'startGameLoop')
        GameLoop.ShouldLoop = true
        
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
            entityMan.clientEntities.forEach((localEntity: LocalEntity) => {
                const clientEntity = localEntity.clientEntity

                if (exists(clientEntity)) {
                    if (typeof clientEntity.update === 'function') {
                        clientEntity.update()
                    }
                    
                    // Check x + xVel for entity if colliding or in path colliding via CollisionManager B)
                    entityMan.gravityManager.applyVelocityToEntity(clientEntity)
                }
            })

            camera.update()
            gameStateMan.update()
            particleMan.update()
            this.tooltipManager.update()
        }

        requestAnimationFrame(this.gameLoop.bind(this))
    }
}
