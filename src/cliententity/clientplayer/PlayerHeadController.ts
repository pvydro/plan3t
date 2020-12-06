import { IUpdatable } from '../../interface/IUpdatable'
import { PlayerHead } from './PlayerHead'

export interface IPlayerHeadController extends IUpdatable {

}

export interface PlayerHeadControllerOptions {
    playerHead: PlayerHead
}

export class PlayerHeadController implements IPlayerHeadController {
    playerHead: PlayerHead

    constructor(options: PlayerHeadControllerOptions) {
        this.playerHead = options.playerHead
    }

    update() {
    }
}
