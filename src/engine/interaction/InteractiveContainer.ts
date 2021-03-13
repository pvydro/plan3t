import { Key } from 'ts-keycode-enum'
import { ClientPlayer, IClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { IUpdatable } from '../../interface/IUpdatable'
import { DebugConstants } from '../../utils/Constants'
import { Container, IContainer } from '../display/Container'
import { IDimension } from '../math/Dimension'
import { IRect, Rect } from '../math/Rect'
import { InteractiveContainerDebugger } from './InteractiveContainerDebugger'

export interface IInteractiveContainer extends IContainer, IUpdatable {
    interact(): Promise<any>
}

export interface InteractiveContainerOptions {
    interactKey: Key
    interactiveBounds: IDimension
}

export class InteractiveContainer extends Container implements IInteractiveContainer {
    interactKey: Key
    currentInteractionPromise: Promise<any>
    player?: IClientPlayer
    debugger?: InteractiveContainerDebugger
    // canInteract: boolean = false
    interactiveBounds: IRect
    
    constructor(options?: InteractiveContainerOptions) {
        super()

        let width = 72
        let height = 72

        if (options !== undefined) {
            if (options.interactiveBounds !== undefined) {
                width = options.interactiveBounds.width
                height = options.interactiveBounds.height
            }
        }

        this.player = ClientPlayer.getInstance()
        this.interactiveBounds = new Rect({
            x: 0, y: 0,
            width, height
        })

        // Debugger
        if (DebugConstants.ShowInteractiveContainerDebug) {
            this.debugger = new InteractiveContainerDebugger({
                interactiveRect: this.interactiveBounds
            })

            this.addChild(this.debugger)
        }
    }

    update() {
        this.interactiveBounds.x = this.halfWidth - (this.interactiveBounds.width / 2)

    }

    interact(): Promise<any> {
        if (this.currentInteractionPromise !== undefined) {
            return this.currentInteractionPromise
        }
    }
}
