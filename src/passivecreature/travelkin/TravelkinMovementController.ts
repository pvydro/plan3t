import { IUpdatable } from '../../interface/IUpdatable'
import { ITravelkinPassiveCreature } from './TravelKinPassiveCreature'

export interface ITravelkinMovementController extends IUpdatable {

}

export interface TravelkinMovementControllerOptions {
    travelkin: ITravelkinPassiveCreature
}

export class TravelkinMovementController implements ITravelkinMovementController {
    travelkin: ITravelkinPassiveCreature

    constructor(options: TravelkinMovementControllerOptions) {
        this.travelkin = options.travelkin
    }

    update() {
        
    }
}
