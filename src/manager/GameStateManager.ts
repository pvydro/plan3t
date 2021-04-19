import { GameplayState } from '../gamestate/GameplayState'
import { GameState, GameStateOptions, IGameState } from '../gamestate/GameState'
import { HomeshipState } from '../gamestate/HomeshipState'
import { IDemolishable } from '../interface/IDemolishable'
import { Game, IGame } from '../main/Game'
import { Flogger } from '../service/Flogger'

export interface IGameStateManager extends IDemolishable {
    initialize(): void
    update(): void
    setGame(game: Game)
}

export interface GameStateManagerOptions {
    game: Game
    defaultState?: GameStateID
}

export enum GameStateID {
    StartMenu = 'startmenu',
    Gameplay = 'gameplay',
    Homeship = 'spaceship',
    Empty = 'empty'
}

export class GameStateManager implements IGameStateManager {
    private static Instance: IGameStateManager
    _currentState: IGameState
    _currentStateID: GameStateID
    _defaultState
    game?: Game

    static getInstance() {
        if (!GameStateManager.Instance) {
            GameStateManager.Instance = new GameStateManager()
        }

        return GameStateManager.Instance
    }

    private constructor() {
        this._defaultState = GameStateID.Homeship // GameStateID.Gameplay
    }

    initialize() {
        Flogger.log('GameStateManager', 'initialize')

        this.enterState(this.defaultState)
    }
    
    update() {
        this.currentState.update()
    }

    enterState(id: GameStateID) {
        Flogger.log('GameStateManager', 'enterState', 'id', id)

        if (this.currentState !== undefined) {
            this.currentState.demolish()
        }

        this._currentState = this.getStateByID(id)

        this._currentState.initialize()
    }

    demolish() {
        //
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

    setGame(game: Game) {
        this.game = game
    }
}
