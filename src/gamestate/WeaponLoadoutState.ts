import { GameStateID } from '../manager/GameStateManager'
import { GameState, GameStateOptions } from './GameState'

export interface IWeaponLoadoutState {

}

export class WeaponLoadoutState extends GameState implements IWeaponLoadoutState {
    constructor(options: GameStateOptions) {
        super({
            id: GameStateID.WeaponLoadout,
            game: options.game
        })
    }
}
