import { IUpdatable } from '../../interface/IUpdatable'
import { AI, AIOptions, IAI } from '../AI'
import { GroundPatherDebugger, IGroundPatherDebugger } from './GroundPatherDebugger'

export interface IGroundPatherAI extends IAI, IUpdatable {
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
    debugger: IGroundPatherDebugger

    constructor(options: GroundPatherOptions) {
        super(options)

        this.debugger = new GroundPatherDebugger({ groundPather: this })
    }

    initialize() {

    }

    update() {
        this.debugger.update()
    }

    findPointOnCurrentGround() {
        throw new Error('Method not implemented.')
    }

    findNewGround() {
        throw new Error('Method not implemented.')
    }

    setCurrentGround() {
        throw new Error('Method not implemented.')
    }
}
