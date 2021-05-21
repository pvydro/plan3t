import { Game } from '../main/Game'
import { ClientManager, IClientManager } from '../manager/ClientManager'
import { GameMapManager, IGameMapManager } from '../manager/GameMapManager'
import { GameStateID } from '../manager/GameStateManager'
import { IMusicManager, MusicManager } from '../manager/musicmanager/MusicManager'
import { IRoomManager, RoomManager } from '../manager/roommanager/RoomManager'
import { log } from '../service/Flogger'
import { InGameHUD } from '../ui/ingamehud/InGameHUD'

export interface IGameState {
    initialize(): Promise<void>
    exit(): Promise<void>
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
    roomManager: IRoomManager
    clientManager: IClientManager
    gameMapManager: IGameMapManager
    musicManager: IMusicManager
    
    constructor(options: GameStateOptions) {
        this.id = options.id ?? GameStateID.Empty
        this.game = options.game

        this.clientManager = this.game.clientManager
        this.gameMapManager = new GameMapManager()
        this.roomManager = RoomManager.getInstance({
            clientManager: this.clientManager,
            gameMapManager: this.gameMapManager
        })
        this.musicManager = MusicManager.getInstance()
        this.inGameHUD = InGameHUD.getInstance()
    }

    async initialize() {
        log('GameState', 'initialize', 'id', this.id)

        return
    }

    async exit() {
        log('GameState', 'exit', 'id', this.id)
        
        const clientManager = ClientManager.getInstance()

        this.camera.clear()
        this.camera.clearFollowTarget()
        clientManager.clearEntityManager()

        return
    }

    update() {
        return
    }
    
    get camera() {
        return this.game.camera
    }

    get cameraStage() {
        return this.camera.stage
    }

    get cameraViewport() {
        return this.game.cameraViewport
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
