import { ICamera } from '../camera/Camera'
import { IEntityManager } from './entitymanager/EntityManager'
import { GameMap, IGameMap } from '../gamemap/GameMap'
import { Game } from '../main/Game'
import { IUpdatable } from '../interface/IUpdatable'
import { Flogger, log } from '../service/Flogger'
import { gameStateMan } from '../shared/Dependencies'

export interface IClientManager extends IUpdatable {
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
