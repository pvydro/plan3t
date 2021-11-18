import * as PIXI from 'pixi.js'
import { LocalEntity } from '../manager/entitymanager/EntityManager'
import { IGravityManager } from '../manager/GravityManager'
import { Flogger } from '../service/Flogger'
import { camera, entityMan, gameStateMan, inGameHUD, particleMan, toolTipMan } from '../shared/Dependencies'
import { exists, functionExists } from '../utils/Utils'

export interface IGameLoop {
    startGameLoop(): void
    stopGameLoop(): void
}

export class GameLoop implements IGameLoop {
    static ShouldLoop: boolean = true
    static Delta: number = 1
    static CustomDelta: number = 1
    _initialized: boolean = false
    gravityManager: IGravityManager

    constructor() {
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
                    if (functionExists(clientEntity.update)) {
                        clientEntity.update()
                    }
                    
                    // Check x + xVel for entity if colliding or in path colliding via CollisionManager B)
                    entityMan.gravityManager.applyVelocityToEntity(clientEntity)
                }
            })

            camera.update()
            gameStateMan.update()
            particleMan.update()
            inGameHUD.update()
            toolTipMan.update()
        }

        requestAnimationFrame(this.gameLoop.bind(this))
    }
}
