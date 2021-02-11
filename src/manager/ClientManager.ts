import { Client } from 'colyseus.js';
import { ENDPOINT } from '../network/Network'
import { Camera, ICamera } from '../camera/Camera'
import { IEntityManager } from './entitymanager/EntityManager'
import { GameMap, IGameMap } from '../gamemap/GameMap'
import { GameStateManager, IGameStateManager } from './GameStateManager'
import { Game } from '../main/Game'
import { IUpdatable } from '../interface/IUpdatable'

export interface IClientManager extends IUpdatable {
    client: Client
    clientCamera: ICamera
    entityManager: IEntityManager
    gameStateManager: IGameStateManager
    gameMap: IGameMap
    initialize(): Promise<void>
}

export interface ClientManagerOptions {
    entityManager: IEntityManager
    game: Game
}

export class ClientManager implements ClientManager {
    _client: Client
    _camera: ICamera
    _gameMap: GameMap
    _game: Game

    _entityManager: IEntityManager
    _gameStateManager: IGameStateManager

    constructor(options: ClientManagerOptions) {
        this._game = options.game
        this._camera = options.game.camera
        this._entityManager = options.entityManager
    }

    async initialize() {
        this._client = new Client(ENDPOINT)
        this._gameStateManager = new GameStateManager({ game: this._game })
    }

    update() {
        if (this._gameStateManager) {
            this._gameStateManager.update()
        }

        this._entityManager.update()
    }

    get client() {
        return this._client
    }

    get clientCamera() {
        return this._camera
    }

    get entityManager() {
        return this._entityManager
    }

    get game() {
        return this._game
    }

    get gameMap() {
        return this._gameMap
    }

    get gameStateManager() {
        return this._gameStateManager
    }
}