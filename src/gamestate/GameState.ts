import { CameraServerDebugPlugin } from '../camera/plugin/CameraServerDebuggerPlugin'
import { Game } from '../main/Game'
import { GameStateID } from '../manager/gamestatemanager/GameStateManager'
import { IMusicManager, MusicManager } from '../manager/musicmanager/MusicManager'
import { log } from '../service/Flogger'
import { camera, entityMan } from '../shared/Dependencies'
import { CrosshairState } from '../ui/ingamehud/crosshair/Crosshair'
import { InGameHUD } from '../ui/ingamehud/InGameHUD'

export interface IGameState {
    initialize(): Promise<void>
    exit(): Promise<void>
    gameOver(): void
    update(): void
}

export interface GameStateOptions {
    id?: GameStateID
    game: Game
}

export abstract class GameState implements IGameState {
    id: GameStateID
    game: Game
    inGameHUD: InGameHUD
    musicManager: IMusicManager
    
    constructor(options: GameStateOptions) {
        this.id = options.id ?? GameStateID.Empty
        this.game = options.game

        this.musicManager = MusicManager.getInstance()
        this.inGameHUD = InGameHUD.getInstance()
    }

    async initialize() {
        log('GameState', 'initialize', 'id', this.id)

        this.inGameHUD.requestCrosshairState(CrosshairState.Cursor)
        this.inGameHUD.crosshair.show()
        camera.viewport.addChild(this.inGameHUD.crosshair)
        
        await Game.showLoadingScreen(false)
    }

    async exit() {
        log('GameState', 'exit', 'id', this.id)

        camera.clear()
        camera.clearFollowTarget()
        entityMan.clearClientEntities()
    }

    gameOver() {
        log('GameState', 'gameOver', 'id', this.id)

    }

    update() {
        return
    }

    get stage() {
        return this.game.stage
    }

    get name() {
        return (this.id + 'State')
    }
}
