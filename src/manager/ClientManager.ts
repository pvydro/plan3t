import { IEntityManager } from './entitymanager/EntityManager'
import { GameMap, IGameMap } from '../gamemap/GameMap'
import { Game } from '../main/Game'
import { IUpdatable } from '../interface/IUpdatable'
import { Flogger, log } from '../service/Flogger'
import { gameStateMan } from '../shared/Dependencies'

export interface IClientManager {
    gameMap: IGameMap
    initialize(): Promise<void>
}

export interface ClientManagerOptions {
    game: Game
}

export class ClientManager implements IClientManager {
    private static Instance: IClientManager
    _gameMap: GameMap
    _game: Game

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
    }

    async initialize() {
        gameStateMan.setGame(this._game)
        await gameStateMan.initialize()
    }

    get game() {
        return this._game
    }

    get gameMap() {
        return this._gameMap
    }
}
