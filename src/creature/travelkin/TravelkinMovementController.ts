import { GroundPatherAI, IGroundPatherAI } from '../../ai/groundpather/GroundPatherAI'
import { IUpdatable } from '../../interface/IUpdatable'
import { ITravelkinCreature } from './TravelkinCreature'

export interface ITravelkinMovementController extends IUpdatable {

}

export interface TravelkinMovementControllerOptions {
    travelkin: ITravelkinCreature
}

export class TravelkinMovementController implements ITravelkinMovementController {
    travelkin: ITravelkinCreature
    ai: IGroundPatherAI

    constructor(options: TravelkinMovementControllerOptions) {
        this.travelkin = options.travelkin

        this.ai = new GroundPatherAI({
            gravityEntity: this.travelkin
        })
    }

    update() {
        this.ai.update()
    }
}
