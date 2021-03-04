import { GameplayState } from '../gamestate/GameplayState'
import { GameState, IGameState } from '../gamestate/GameState'
import { IDemolishable } from '../interface/IDemolishable'
import { Game } from '../main/Game'
import { Flogger } from '../service/Flogger'

export interface IGameStateManager extends IDemolishable {
    initialize()
    update()
}

export interface GameStateManagerOptions {
    game: Game
    defaultState?: GameStateID
}

export enum GameStateID {
    StartMenu = 'startmenu',
    Gameplay = 'gameplay',
    Spaceship = 'spaceship',
    Empty = 'empty'
}

export class GameStateManager implements IGameStateManager {
    _currentState: IGameState
    _currentStateID: GameStateID
    _defaultState
    game: Game

    constructor(options: GameStateManagerOptions) {
        this.game = options.game
        this._defaultState = options.defaultState ?? GameStateID.Gameplay
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

        switch (id) {
            default:
            case GameStateID.Gameplay:
                state = new GameplayState({ game: this.game })
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
}
