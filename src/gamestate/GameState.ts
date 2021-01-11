import { IDemolishable } from "../interface/IDemolishable";
import { Game } from "../main/Game";
import { GameStateID } from "../manager/GameStateManager";

export interface IGameState extends IDemolishable {
    initialize(): Promise<void>
    update(): void
}

export interface GameStateOptions {
    id?: GameStateID
    game: Game
}

export abstract class GameState implements IGameState {
    id: GameStateID
    game: Game
    
    constructor(options: GameStateOptions) {
        this.id = options.id ?? GameStateID.Empty
        this.game = options.game
    }

    initialize(): Promise<void> {
        return
    }

    update() {
        return
    }
    
    demolish() {
        return
    }
}
