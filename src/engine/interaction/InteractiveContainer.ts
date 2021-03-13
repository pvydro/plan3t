import { IUpdatable } from '../../interface/IUpdatable'
import { Container, IContainer } from '../display/Container'

export interface IInteractiveContainer extends IContainer {
    interact(): Promise<any>
}

export interface InteractiveContainerOptions {

}

export class InteractiveContainer extends Container implements IInteractiveContainer {
    currentInteractionPromise: Promise<any>

    constructor(options?: InteractiveContainerOptions) {
        super()
    }

    interact(): Promise<any> {
        if (this.currentInteractionPromise !== undefined) {
            return this.currentInteractionPromise
        }
    }
}
