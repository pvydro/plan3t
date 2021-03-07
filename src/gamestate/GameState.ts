import { IDemolishable } from '../interface/IDemolishable'
import { Game } from '../main/Game'
import { IClientManager } from '../manager/ClientManager'
import { GameMapManager, IGameMapManager } from '../manager/GameMapManager'
import { GameStateID } from '../manager/GameStateManager'
import { IRoomManager, RoomManager } from '../manager/roommanager/RoomManager'

export interface IGameState extends IDemolishable {
    initialize(): Promise<void>
    update(): void
}

export interface GameStateOptions {
    id?: GameStateID
    game: Game
}

export abstract class GameState implements IGameState {
    id: GameStateID
    game: Game
    roomManager: IRoomManager
    clientManager: IClientManager
    gameMapManager: IGameMapManager
    
    constructor(options: GameStateOptions) {
        this.id = options.id ?? GameStateID.Empty
        this.game = options.game

        this.clientManager = this.game.clientManager
        this.gameMapManager = new GameMapManager({
            clientManager: this.clientManager
        })
        this.roomManager = RoomManager.getInstance({
            clientManager: this.clientManager,
            gameMapManager: this.gameMapManager
        })
    }

    initialize(): Promise<void> {
        return
    }

    update() {
        return
    }
    
    demolish() {
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
}
