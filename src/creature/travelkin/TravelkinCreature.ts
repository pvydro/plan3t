import { GroundPatherAI, IGroundPatherAI } from '../../ai/groundpather/GroundPatherAI'
import { ICreature, Creature, CreatureOptions } from '../Creature'
import { ITravelkinMovementController, TravelkinMovementController } from './TravelkinMovementController'

export enum TravelkinMovementState {
    Idle,
    Walking
}

export interface ITravelkinCreature extends ICreature {
    ai: IGroundPatherAI
    movementState: TravelkinMovementState
    walkSpeed: number
}

export interface TravelkinCreatureOptions extends CreatureOptions {
    walkSpeed: number
}

export class TravelkinCreature extends Creature implements ITravelkinCreature {
    _movementState: TravelkinMovementState = TravelkinMovementState.Idle
    walkSpeed: number
    ai: IGroundPatherAI
    movementController: ITravelkinMovementController

    constructor(options: TravelkinCreatureOptions) {
        super(options)

        const travelkin = this

        this.walkSpeed = options.walkSpeed
        this.ai = new GroundPatherAI({ gravityEntity: travelkin })
        this.movementController = new TravelkinMovementController({ travelkin })
    }

    update() {
        this.ai.update()
        this.movementController.update()
        
        super.update()
    }

    get movementState() {
        return this._movementState
    }

    set movementState(value: TravelkinMovementState) {
        this._movementState = value
    }
}
