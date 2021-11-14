import { CameraServerDebugPlugin } from '../camera/plugin/CameraServerDebuggerPlugin'
import { Game } from '../main/Game'
import { GameStateID } from '../manager/gamestatemanager/GameStateManager'
import { log } from '../service/Flogger'
import { camera, entityMan, inGameHUD } from '../shared/Dependencies'
import { CrosshairState } from '../ui/ingamehud/crosshair/Crosshair'

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
    
    constructor(options: GameStateOptions) {
        this.id = options.id ?? GameStateID.Empty
        this.game = options.game

    }

    async initialize() {
        log('GameState', 'initialize', 'id', this.id)

        inGameHUD.requestCrosshairState(CrosshairState.Cursor)
        inGameHUD.crosshair.show()
        camera.viewport.addChild(inGameHUD.crosshair)
        
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
