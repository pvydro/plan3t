import { GameStateFactory, IGameStateFactory } from '../../factory/GameStateFactory'
import { GameState, IGameState } from '../../gamestate/GameState'
import { IDemolishable } from '../../interface/IDemolishable'
import { Game } from '../../main/Game'
import { log } from '../../service/Flogger'
import { gameStateMan } from '../../shared/Dependencies'

export interface IGameStateManager extends IDemolishable {
    currentState: IGameState
    currentStateID: GameStateID
    enterState(id: GameStateID): Promise<void>
    initialize(): void
    update(): void
    gameOver(): void
    setGame(game: Game)
}

export interface GameStateManagerOptions {
    game: Game
    defaultState?: GameStateID
}

export enum GameStateID {
    // Game
    Gameplay = 'Gameplay',
    WaveRunnerGame = 'WaveGame',
    Homeship = 'Spaceship',
    Empty = 'Empty',
    // Menu
    StartMenu = 'StartMenu',
    StyleMenu = 'StyleMenu',
    LoadoutMenu = 'LoadoutMenu',
    WagerMenu = 'WagerMenu'
}

export class GameStateManager implements IGameStateManager {
    private static Instance: IGameStateManager
    _currentState?: IGameState
    _currentStateID: GameStateID
    _defaultState: GameStateID = GameStateID.StartMenu
    factory: IGameStateFactory
    game?: Game

    constructor() {
        this.factory = new GameStateFactory()
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
        this._currentState = this.createStateByID(id)

        await this.currentState.initialize()
    }

    async exitState() {
        log('GameStateManager', 'exitState', 'id', this.currentStateID)
        
        if (this.currentState) {
            await this.currentState.exit()
            this._currentState = undefined
        }
    }

    gameOver() {
        log('GameStateManager', 'gameOver', 'id', this.currentStateID)

        this.currentState.gameOver()
    }

    demolish() {
        log('GameStateManager', 'demolish', 'id', this.currentStateID)

        this.exitState()
    }

    createStateByID(id: GameStateID): GameState {
        return this.factory.createGameStateForID(id, this.game)
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
        return gameStateMan.currentStateID
    }

    setGame(game: Game) {
        this.game = game
    }
}
