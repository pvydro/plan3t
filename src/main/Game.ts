import * as PIXI from 'pixi.js'
import { Flogger, log } from '../service/Flogger'
import { Spritesheets } from '../asset/Spritesheets'
import { GameWindow } from '../utils/Constants'
import { ClientManager, IClientManager } from '../manager/ClientManager'
import { EntityManager, IEntityManager } from '../manager/entitymanager/EntityManager'
import { IGameLoop, GameLoop } from '../gameloop/GameLoop'
import { Assets } from '../asset/Assets'
import { Camera } from '../camera/Camera'
import { Viewport } from '../camera/Viewport'
import { Fonts } from '../asset/Fonts'
import { Tween } from '../engine/display/tween/Tween'
import { LoadingScreen } from '../ui/uiscreen/loadingscreen/LoadingScreen'
import { asyncTimeout } from '../utils/Utils'
import { Sounds } from '../asset/Sounds'
import { MusicLoader } from '../music/MusicLoader'
import { camera, matchMaker, musicLoader } from '../shared/Dependencies'
import { DecorationDirectory } from '../gamemap/mapbuilding/DecorationDirectory'

export interface IGame {
    view: any
    renderer: PIXI.Renderer

    bootstrap(): Promise<void>
}

export class Game implements IGame {
    private static Instance: IGame
    _application: PIXI.Application
    _clientManager: IClientManager
    _loadingScreen: LoadingScreen
    gameLoop: IGameLoop

    static getInstance() {
        if (!this.Instance) {
            this.Instance = new Game()
        }

        return this.Instance
    }

    private constructor() {
        this.instantiateApplication()

        const game = this
        this._clientManager = ClientManager.getInstance({ game })
        this._loadingScreen = LoadingScreen.getInstance()
    }

    async bootstrap() {
        Flogger.log('Game', 'bootstrap')

        await Assets.loadImages()
        await musicLoader.loadSongs()
        await Fonts.loadFonts()
        await Spritesheets.loadSpritesheets()
        await Sounds.loadSounds()
        await Tween.initializePlugins()
        await DecorationDirectory.assembleDirectory()
        
        await this.clientManager.initialize()

        this.stage.addChild(camera.viewport)
        this.stage.addChild(this._loadingScreen)
        this.initializeGameLoop()
    }

    instantiateApplication() {
        const gameCanvas: HTMLCanvasElement = document.getElementById('game-canvas') as HTMLCanvasElement

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
        PIXI.settings.ROUND_PIXELS = true

        this._application = new PIXI.Application({
            width: GameWindow.fullWindowWidth,
            height: GameWindow.fullWindowHeight,
            backgroundColor: 0x080808,
            antialias: false,
            view: gameCanvas
        })
    }

    initializeGameLoop() {
        this.gameLoop = new GameLoop({
            clientManager: this.clientManager
            // roomManager: this.roomManager
        })

        this.gameLoop.startGameLoop()
    }

    static async showLoadingScreen(shouldShow: boolean, timeout?: number) {
        log('Game', 'showLoadingScreen', 'shouldShow', shouldShow)

        if (timeout !== undefined) await asyncTimeout(timeout)
        
        const screen = LoadingScreen.getInstance()

        if (shouldShow) {
            return screen.show()
        } else {
            return screen.hide()
        }
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

    get clientManager() {
        return this._clientManager
    }
}
