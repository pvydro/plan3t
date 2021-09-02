import { GameplayState } from '../gamestate/GameplayState'
import { GameState, GameStateOptions, IGameState } from '../gamestate/GameState'
import { HomeshipState } from '../gamestate/HomeshipState'
import { StartMenuState } from '../gamestate/StartMenuState'
import { WaveGameState } from '../gamestate/WaveGameState'
import { IDemolishable } from '../interface/IDemolishable'
import { Game } from '../main/Game'
import { log } from '../service/Flogger'

export interface IGameStateManager extends IDemolishable {
    currentState: IGameState
    currentStateID: GameStateID
    enterState(id: GameStateID): Promise<void>
    initialize(): void
    update(): void
    setGame(game: Game)
}

export interface GameStateManagerOptions {
    game: Game
    defaultState?: GameStateID
}

export enum GameStateID {
    StartMenu = 'StartMenu',
    Gameplay = 'Gameplay',
    WaveRunnerGame = 'WaveGame',
    Homeship = 'Spaceship',
    Empty = 'Empty',
    WeaponLoadout = 'WeaponLoadout'
}

export class GameStateManager implements IGameStateManager {
    private static Instance: IGameStateManager
    _currentState?: IGameState
    _currentStateID: GameStateID
    _defaultState: GameStateID = GameStateID.WaveRunnerGame
    game?: Game

    static getInstance() {
        if (!GameStateManager.Instance) {
            GameStateManager.Instance = new GameStateManager()
        }

        return GameStateManager.Instance
    }

    private constructor() {
        
    }

    initialize() {
        log('GameStateManager', 'initialize')

        this.enterState(this.defaultState)
    }
    
    update() {
        if (this.currentState) {
            this.currentState.update()
        }
    }

    async enterState(id: GameStateID) {
        log('GameStateManager', 'enterState', 'id', id)

        if (this.currentState) {
            log('GameStateManager', 'Already in a state, exiting first...')
            
            await this.exitState()
        }

        this._currentStateID = id
        this._currentState = this.getStateByID(id)

        await this.currentState.initialize()
    }

    async exitState() {
        log('GameStateManager', 'exitState', 'id', this.currentStateID)
        
        if (this.currentState) {
            await this.currentState.exit()
            this._currentState = undefined
        }
    }

    demolish() {
        log('GameStateManager', 'demolish', 'id', this.currentStateID)

        this.exitState()
    }

    getStateByID(id: GameStateID): GameState {
        let state: GameState
        const options: GameStateOptions = { game: this.game }

        switch (id) {
            default:
            case GameStateID.Gameplay:
                state = new GameplayState(options)
                break
            case GameStateID.Homeship:
                state = new HomeshipState(options)
                break
            case GameStateID.WaveRunnerGame:
                state = new WaveGameState(options)
                break
            case GameStateID.StartMenu:
                state = new StartMenuState(options)
                break
                
        }

        return state
    }

    get defaultState() {
        return this._defaultState
    }
    
    get currentState() {
        return this._currentState
    }

    get currentStateID() {
        return this._currentStateID
    }

    static getCurrentStateID() {
        return GameStateManager.getInstance().currentStateID
    }

    setGame(game: Game) {
        this.game = game
    }
}
