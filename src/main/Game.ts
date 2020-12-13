import * as PIXI from 'pixi.js'
import * as Viewport from 'pixi-viewport'
import { LoggingService } from '../service/LoggingService'
import { Spritesheets } from '../asset/Spritesheets'
import { WindowSize, WorldSize } from '../utils/Constants'
import { IRoomManager } from '../manager/RoomManager'
import { IClientManager } from '../manager/ClientManager'
import { IEntityManager } from '../manager/EntityManager'
import { IGameLoop, GameLoop } from '../gameloop/GameLoop'
import { GameMapManager, IGameMapManager } from '../manager/GameMapManager'

export interface IGame {
    bootstrap(): Promise<void>
    view: any
    cameraViewport: Viewport
    renderer: PIXI.Renderer
}

export interface GameOptions {
    roomManager: IRoomManager
    clientManager: IClientManager
    entityManager: IEntityManager
}

export class Game implements IGame {
    _application: PIXI.Application

    roomManager: IRoomManager
    clientManager: IClientManager
    gameMapManager: IGameMapManager

    gameLoop: IGameLoop

    constructor(options: GameOptions) {
        this.roomManager = options.roomManager
        this.clientManager = options.clientManager

        this.gameMapManager = new GameMapManager({
            clientManager: this.clientManager
        })

        this.instantiateApplication()
    }

    async bootstrap() {
        LoggingService.log('Game', 'bootstrap')

        await Spritesheets.loadSpritesheets()

        // TODO: Main loader load, then other inits
        // Internal state manager for loading screen, Scene
        await this.clientManager.initialize()
        await this.roomManager.initializeRoom()
        
        this.initializeBackground()
        await this.initializeGameMap()
        // this.initializeMouseMovement()
        this.initializeGameLoop()
        this.initializeCamera()
    }

    instantiateApplication() {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

        this._application = new PIXI.Application({
            width: WindowSize.width,
            height: window.innerHeight,
            backgroundColor: 0x0c0c0c,
            antialias: false,
        })
    }
    
    initializeCamera() {
        this.stage.addChild(this.cameraViewport)
    }

    initializeGameLoop() {
        this.gameLoop = new GameLoop({
            clientManager: this.clientManager,
            roomManager: this.roomManager
        })

        this.gameLoop.startGameLoop()
    }

    initializeMouseMovement() {
        this.cameraViewport.on('mousemove', (e) => {
            const point = this.cameraViewport.toLocal(e.data.global)
            this.room.send('mouse', { x: point.x, y: point.y })
        })
    }

    initializeBackground() {
        const boundaries = new PIXI.Graphics()
        boundaries.beginFill(0x000000)
        boundaries.drawRoundedRect(0, 0, WorldSize.width, WorldSize.height, 30)
        this.cameraViewport.addChild(boundaries)
    }

    async initializeGameMap() {
        await this.gameMapManager.initialize()
    }

    get room() {
        return this.roomManager.currentRoom
    }

    get gameMap() {
        return this.clientManager.gameMap
    }

    get application(): PIXI.Application {
        return this._application
    }

    get view() {
        return this._application.view
    }

    get camera() {
        return this.clientManager.clientCamera
    }

    get cameraViewport() {
        return this.clientManager.clientCamera.viewport
    }

    get renderer() {
        return this._application.renderer
    }

    get stage() {
        return this._application.stage
    }
}