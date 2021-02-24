import { ITravelkinCreature } from './TravelkinCreature'

export interface ITravelkinMovementController {

}

export interface TravelkinMovementControllerOptions {
    travelkin: ITravelkinCreature
}

export class TravelkinMovementController implements ITravelkinMovementController {
    travelkin: ITravelkinCreature

    constructor(options: TravelkinMovementControllerOptions) {
        this.travelkin = options.travelkin
    }
}
