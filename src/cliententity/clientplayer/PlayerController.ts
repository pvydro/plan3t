export interface IPlayerController {

}

export interface PlayerControllerOptions {
    player: IClientPlayer
}

export class PlayerController {
    player: IClientPlayer

    constructor(options: PlayerControllerOptions) {
        this.player = options.player
    }
}
