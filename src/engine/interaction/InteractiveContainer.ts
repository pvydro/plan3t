import { Key } from 'ts-keycode-enum'
import { ClientPlayer, IClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { IUpdatable } from '../../interface/IUpdatable'
import { DebugConstants } from '../../utils/Constants'
import { Container, IContainer } from '../display/Container'
import { IDimension } from '../math/Dimension'
import { IRect, Rect } from '../math/Rect'
import { InteractiveContainerDebugger } from './InteractiveContainerDebugger'

export interface IInteractiveContainer extends IContainer, IUpdatable {
    interactiveBounds: IRect
    canInteract: boolean
    interact(): Promise<any>
}

export interface InteractiveContainerOptions {
    interactKey?: Key
    interactiveBounds?: IDimension
    interactiveOffsetX?: number
}

export class InteractiveContainer extends Container implements IInteractiveContainer {
    interactKey: Key
    currentInteractionPromise: Promise<any>
    player?: IClientPlayer
    debugger?: InteractiveContainerDebugger
    interactiveBounds: Rect
    canInteract: boolean = false
    interactiveOffsetX: number = 0
    interactiveSimuRect: Rect
    
    constructor(options?: InteractiveContainerOptions) {
        super()

        let width = 72
        let height = 72

        if (options !== undefined) {
            if (options.interactiveBounds !== undefined) {
                width = options.interactiveBounds.width
                height = options.interactiveBounds.height
            }
            if (options.interactKey !== undefined) {
                this.interactKey = options.interactKey
            }
            if (options.interactiveOffsetX !== undefined) {
                this.interactiveOffsetX = options.interactiveOffsetX
            }
        }

        this.player = ClientPlayer.getInstance()
        this.interactiveBounds = new Rect({
            x: 0, y: 0,
            width, height
        })
        this.interactiveSimuRect = new Rect({
            x: this.x, y: this.y,
            width: this.interactiveBounds.width, height: this.interactiveBounds.height
        })

        // Debugger
        if (DebugConstants.ShowInteractiveContainerDebug) {
            this.debugger = new InteractiveContainerDebugger({
                container: this
            })

            this.addChild(this.debugger)
        }
    }

    update() {
        this.interactiveBounds.x = this.interactiveOffsetX - (this.interactiveBounds.width / 2)
        this.interactiveSimuRect.x = this.x + this.interactiveBounds.x
        this.interactiveSimuRect.y = this.y

        // Interactable sensing
        if (this.player !== undefined) {
            if (this.interactiveSimuRect.contains(this.player.x, this.player.y)) {
                console.log('oh')
                this.canInteract = true
            } else {
                this.canInteract = false
            }
        } else {
            this.player = ClientPlayer.getInstance()
        }

        if (this.debugger !== undefined) {
            this.debugger.update()
        }
    }

    interact(): Promise<any> {
        if (this.currentInteractionPromise !== undefined) {
            return this.currentInteractionPromise
        }
    }
}
