import { ICreature, Creature, CreatureOptions } from '../Creature'
import { ITravelkinMovementController, TravelkinMovementController } from './TravelkinMovementController'

export interface ITravelkinCreature extends ICreature {

}

export interface TravelkinCreatureOptions extends CreatureOptions {
    walkSpeed: number
}

export class TravelkinCreature extends Creature implements ITravelkinCreature {
    walkSpeed: number
    movementController: ITravelkinMovementController

    constructor(options: TravelkinCreatureOptions) {
        super(options)
        const travelkin = this

        this.walkSpeed = options.walkSpeed
        this.movementController = new TravelkinMovementController({ travelkin })
    }

    update() {
        this.movementController.update()
    }
}
