import * as PIXI from 'pixi.js'
import { Flogger } from '../service/Flogger'
import { Spritesheets } from '../asset/Spritesheets'
import { WindowSize } from '../utils/Constants'
import { ClientManager, IClientManager } from '../manager/ClientManager'
import { EntityManager } from '../manager/entitymanager/EntityManager'
import { IGameLoop, GameLoop } from '../gameloop/GameLoop'
import { Assets } from '../asset/Assets'
import { Camera } from '../camera/Camera'
import { ParticleManager } from '../manager/particlemanager/ParticleManager'
import { Viewport } from '../camera/Viewport'
import { Fonts } from '../asset/Fonts'
import { Tween } from '../engine/display/tween/Tween'

export interface IGame {
    bootstrap(): Promise<void>
    view: any
    renderer: PIXI.Renderer
    camera: Camera
    cameraViewport: Viewport
}

export class Game implements IGame {
    _application: PIXI.Application
    _clientCamera: Camera
    _clientManager: IClientManager
    _entityManager: EntityManager
    _particleManager: ParticleManager

    gameLoop: IGameLoop

    constructor() {
        this.instantiateApplication()

        const game = this
        this._entityManager = new EntityManager({ game })
        this._clientCamera = Camera.getInstance()
        this._clientManager = new ClientManager({ game, entityManager: this.entityManager })
        this._particleManager = ParticleManager.getInstance()
    }

    async bootstrap() {
        Flogger.log('Game', 'bootstrap')

        await Assets.loadImages()
        await Fonts.loadFonts()
        await Spritesheets.loadSpritesheets()
        await Tween.initializePlugins()
        
        await this.clientManager.initialize()

        this.stage.addChild(this.cameraViewport)
        this.initializeGameLoop()
    }

    instantiateApplication() {
        const gameCanvas: HTMLCanvasElement = document.getElementById('game-canvas') as HTMLCanvasElement

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
        PIXI.settings.ROUND_PIXELS = true

        this._application = new PIXI.Application({
            width: WindowSize.width,
            height: window.innerHeight,
            backgroundColor: 0x0c0c0c,
            antialias: false,
            view: gameCanvas
        })
    }

    initializeGameLoop() {
        this.gameLoop = new GameLoop({
            clientManager: this.clientManager,
            // roomManager: this.roomManager
        })

        this.gameLoop.startGameLoop()
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

    get renderer() {
        return this._application.renderer
    }

    get stage() {
        return this._application.stage
    }

    get entityManager() {
        return this._entityManager
    }

    get clientManager() {
        return this._clientManager
    }

    get camera() {
        return this._clientCamera
    }

    get cameraViewport() {
        return this._clientCamera.viewport
    }
}
