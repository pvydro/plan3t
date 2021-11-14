import { CameraServerDebugPlugin } from '../camera/plugin/CameraServerDebuggerPlugin'
import { Game } from '../main/Game'
import { ClientManager, IClientManager } from '../manager/ClientManager'
import { GameStateID } from '../manager/gamestatemanager/GameStateManager'
import { IMusicManager, MusicManager } from '../manager/musicmanager/MusicManager'
import { log } from '../service/Flogger'
import { camera } from '../shared/Dependencies'
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
    clientManager: IClientManager
    musicManager: IMusicManager
    
    constructor(options: GameStateOptions) {
        this.id = options.id ?? GameStateID.Empty
        this.game = options.game

        this.clientManager = this.game.clientManager
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
        
        const clientManager = ClientManager.getInstance()

        camera.clear()
        camera.clearFollowTarget()
        clientManager.clearEntityManager()
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

    get entityManager() {
        return this.clientManager.entityManager
    }

    get name() {
        return (this.id + 'State')
    }
}
