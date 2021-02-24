import { GroundPatherAI, IGroundPatherAI } from '../../ai/groundpather/GroundPatherAI'
import { ICreature, Creature, CreatureOptions } from '../Creature'
import { ITravelkinMovementController, TravelkinMovementController } from './TravelkinMovementController'

export enum TravelkinMovementState {
    Idle,
    Walking
}

export interface ITravelkinCreature extends ICreature {
    ai: IGroundPatherAI
}

export interface TravelkinCreatureOptions extends CreatureOptions {
    walkSpeed: number
}

export class TravelkinCreature extends Creature implements ITravelkinCreature {
    walkSpeed: number
    ai: IGroundPatherAI
    movementController: ITravelkinMovementController
    movementState: TravelkinMovementState = TravelkinMovementState.Idle

    constructor(options: TravelkinCreatureOptions) {
        super(options)

        const travelkin = this

        this.walkSpeed = options.walkSpeed
        this.ai = new GroundPatherAI({ gravityEntity: travelkin })
        this.movementController = new TravelkinMovementController({ travelkin })
    }

    update() {
        this.ai.update()
        
        super.update()
    }
}
