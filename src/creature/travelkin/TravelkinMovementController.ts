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
        if (this.travelkin.ai.currentNode !== undefined) {
            this.goToCurrentNode()
        }

        const movementState = this.travelkin.movementState
        const direction = this.travelkin.direction
        const targetXVel = this.travelkin.walkSpeed * direction
        
        if (movementState === TravelkinMovementState.Dead) {

            this.travelkin.comeToStop()
            this.travelkin.showDyingSprite()

        } else {
            switch (movementState) {
                case TravelkinMovementState.Walking:
    
                    this.travelkin.xVel += (targetXVel - this.travelkin.xVel) / 3
    
                    break
                case TravelkinMovementState.Idle:
    
                    this.travelkin.comeToStop()
                
                    break
            }
    
            if (this.travelkin.ai.checkIfReachedNode()) {
                this.travelkin.movementState = TravelkinMovementState.Idle
            }
        }
    }

    goToCurrentNode() {
        const currentNode = this.travelkin.ai.currentNode

        if (currentNode.x > this.travelkin.x) {
            this.moveRight()
        } else if (currentNode.x < this.travelkin.x) {
            this.moveLeft()
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
}
