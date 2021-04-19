import { Client } from 'colyseus.js';
import { ENDPOINT } from '../network/Network'
import { Camera, ICamera } from '../camera/Camera'
import { IEntityManager } from './entitymanager/EntityManager'
import { GameMap, IGameMap } from '../gamemap/GameMap'
import { GameStateManager, IGameStateManager } from './GameStateManager'
import { Game } from '../main/Game'
import { IUpdatable } from '../interface/IUpdatable'
import { Flogger, log } from '../service/Flogger';

export interface IClientManager extends IUpdatable {
    client: Client
    clientCamera: ICamera
    entityManager: IEntityManager
    gameStateManager: IGameStateManager
    gameMap: IGameMap
    initialize(): Promise<void>
    clearEntityManager(): void
}

export interface ClientManagerOptions {
    entityManager: IEntityManager
    game: Game
}

export class ClientManager implements IClientManager {
    private static Instance: IClientManager
    _client: Client
    _camera: ICamera
    _gameMap: GameMap
    _game: Game
    _entityManager: IEntityManager
    _gameStateManager: IGameStateManager

    static getInstance(options?: ClientManagerOptions) {
        if (!ClientManager.Instance) {
            if (options !== undefined) {
                ClientManager.Instance = new ClientManager(options)
            } else {
                Flogger.error('Tried to get new ClientManager.Instance with no options')
            }
        }

        return ClientManager.Instance
    }

    private constructor(options: ClientManagerOptions) {
        this._game = options.game
        this._camera = options.game.camera
        this._entityManager = options.entityManager
    }

    async initialize() {
        this._client = new Client(ENDPOINT)
        this._gameStateManager = GameStateManager.getInstance()
        this._gameStateManager.setGame(this._game)
        await this._gameStateManager.initialize()
    }

    update() {
        if (this._gameStateManager) {
            this._gameStateManager.update()
        }

        this._entityManager.update()
    }

    clearEntityManager() {
        log('ClientManager', 'clearEntityManager')
        
        this._entityManager.clearClientEntities()
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