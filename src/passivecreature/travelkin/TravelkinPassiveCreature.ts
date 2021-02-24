import { PassiveCreature, PassiveCreatureOptions } from "../PassiveCreature";
import { ITravelkinMovementController, TravelkinMovementController } from "./TravelkinMovementController";

export interface ITravelkinPassiveCreature {

}

export interface TravelkinPassiveCreatureOptions extends PassiveCreatureOptions {
    walkSpeed: number
}

export class TravelkinPassiveCreature extends PassiveCreature implements ITravelkinPassiveCreature {
    walkSpeed: number

    movementController: ITravelkinMovementController

    constructor(options: TravelkinPassiveCreatureOptions) {
        super(options)
        const travelkin = this

        this.walkSpeed = options.walkSpeed
        this.movementController = new TravelkinMovementController({ travelkin })
    }

    update() {
        this.movementController.update()
    }
}
