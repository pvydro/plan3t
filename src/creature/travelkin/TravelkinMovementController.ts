import { Direction } from '../../engine/math/Direction'
import { IUpdatable } from '../../interface/IUpdatable'
import { ITravelkinCreature, TravelkinMovementState } from './TravelkinCreature'

export interface ITravelkinMovementController extends IUpdatable {

}

export interface TravelkinMovementControllerOptions {
    travelkin: ITravelkinCreature
}

export class TravelkinMovementController implements ITravelkinMovementController {
    travelkin: ITravelkinCreature

    constructor(options: TravelkinMovementControllerOptions) {
        this.travelkin = options.travelkin
    }
    
    update() {
        if (this.currentNode !== undefined) {
            this.goToCurrentNode()
        }
    }

    goToCurrentNode() {
        if (this.currentNode.x > this.travelkin.x) {
            this.moveRight()
        } else if (this.currentNode.x < this.travelkin.x) {
            this.moveLeft()
        }

        const movementState = this.travelkin.movementState
        const direction = this.travelkin.direction
        const targetXVel = this.travelkin.walkSpeed * direction

        switch (movementState) {
            case TravelkinMovementState.Walking:
                
                this.travelkin.xVel = targetXVel

                break
            case TravelkinMovementState.Idle:

                this.travelkin.comeToStop()
            
                break
        }
    }

    moveLeft() {
        this.travelkin.direction = Direction.Left
        this.travelkin.movementState = TravelkinMovementState.Walking
    }

    moveRight() {
        this.travelkin.direction = Direction.Right
        this.travelkin.movementState = TravelkinMovementState.Walking
    }

    get currentNode() {
        return this.travelkin.ai.currentNode
    }
}
