import { AI, AIOptions, IAI } from '../AI'

export interface IGroundPatherAI extends IAI {
    findPointOnCurrentGround(): void
    setCurrentGround(): void
    findNewGround(): void
}

export enum GroundPatherState {
    Wandering,
    Idle,
    Following,
    Scared
}

export interface GroundPatherOptions extends AIOptions {

}

export class GroundPatherAI extends AI implements IGroundPatherAI {
    constructor(options: GroundPatherOptions) {
        super(options)
    }

    initialize() {

    }

    findPointOnCurrentGround() {
        throw new Error('Method not implemented.')
    }

    setCurrentGround() {
        throw new Error('Method not implemented.')
    }

    findNewGround() {
        throw new Error('Method not implemented.')
    }
}
