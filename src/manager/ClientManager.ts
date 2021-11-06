import { Client } from 'colyseus.js';
import { ENDPOINT } from '../network/Network'
import { Camera, ICamera } from '../camera/Camera'
import { IEntityManager } from './entitymanager/EntityManager'
import { GameMap, IGameMap } from '../gamemap/GameMap'
import { IGameStateManager } from './gamestatemanager/GameStateManager'
import { Game } from '../main/Game'
import { IUpdatable } from '../interface/IUpdatable'
import { Flogger, log } from '../service/Flogger';
import { gameStateMan } from '../shared/Dependencies';

export interface IClientManager extends IUpdatable {
    client: Client
    clientCamera: ICamera
    entityManager: IEntityManager
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

    static getInstance(options?: ClientManagerOptions) {
        if (!this.Instance) {
            if (options !== undefined) {
                this.Instance = new ClientManager(options)
            } else {
                Flogger.error('Tried to get new ClientManager.Instance with no options')
            }
        }

        return this.Instance
    }

    private constructor(options: ClientManagerOptions) {
        this._game = options.game
        this._camera = options.game.camera
        this._entityManager = options.entityManager
    }

    async initialize() {
        this._client = new Client(ENDPOINT)
        gameStateMan.setGame(this._game)
        await gameStateMan.initialize()
    }

    update() {
        gameStateMan.update()
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
}
