import { GameplayState } from '../gamestate/GameplayState'
import { GameState, GameStateOptions } from '../gamestate/GameState'
import { HomeshipState } from '../gamestate/HomeshipState'
import { LoadoutMenuState } from '../gamestate/menustate/LoadoutMenuState'
import { StartMenuState } from '../gamestate/menustate/StartMenuState'
import { StyleMenuState } from '../gamestate/menustate/StyleMenuState'
import { WaveGameState } from '../gamestate/WaveGameState'
import { Game } from '../main/Game'
import { GameStateID } from '../manager/gamestatemanager/GameStateManager'

export interface IGameStateFactory {
    createGameStateForID(id: GameStateID, game: Game): GameState
}

export class GameStateFactory implements IGameStateFactory {
    

    constructor() {

    }

    createGameStateForID(id: GameStateID, game: Game): GameState {
        let state: GameState
        const options: GameStateOptions = { game }

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
            
            // Menu
            case GameStateID.StartMenu:
                state = new StartMenuState(options)
                break
            case GameStateID.StyleMenu:
                state = new StyleMenuState(options)
                break
            case GameStateID.LoadoutMenu:
                state = new LoadoutMenuState(options)
                break
        }

        return state
    }
}
