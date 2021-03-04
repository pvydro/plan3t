import { GameStateID } from '../manager/GameStateManager'
import { GameState, GameStateOptions, IGameState } from './GameState'

export interface ISpaceshipState extends IGameState {

}

export class SpaceshipState extends GameState implements ISpaceshipState {
    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.Spaceship
        })
    }

    async initialize() {

    }

    update() {

    }

    demolish() {
        
    }
}
