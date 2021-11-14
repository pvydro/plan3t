import * as PIXI from 'pixi.js'
import { Flogger, log } from '../service/Flogger'
import { Spritesheets } from '../asset/Spritesheets'
import { GameWindow } from '../utils/Constants'
import { IGameLoop, GameLoop } from '../gameloop/GameLoop'
import { Assets } from '../asset/Assets'
import { Fonts } from '../asset/Fonts'
import { Tween } from '../engine/display/tween/Tween'
import { LoadingScreen } from '../ui/uiscreen/loadingscreen/LoadingScreen'
import { asyncTimeout } from '../utils/Utils'
import { Sounds } from '../asset/Sounds'
import { camera, gameStateMan, matchMaker, musicLoader } from '../shared/Dependencies'
import { DecorationDirectory } from '../gamemap/mapbuilding/DecorationDirectory'

export interface IGame {
    view: any
    renderer: PIXI.Renderer

    bootstrap(): Promise<void>
}

export class Game implements IGame {
    private static Instance: IGame
    _application: PIXI.Application
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
        this._loadingScreen = LoadingScreen.getInstance()
        this.gameLoop = new GameLoop()
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
        
        gameStateMan.setGame(this)
        gameStateMan.initialize()
        this.gameLoop.startGameLoop()
        
        this.stage.addChild(camera.viewport)
        this.stage.addChild(this._loadingScreen)
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
}
