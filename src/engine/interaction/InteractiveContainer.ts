import { Key } from 'ts-keycode-enum'
import { ClientPlayer, IClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { IUpdatable } from '../../interface/IUpdatable'
import { Flogger } from '../../service/Flogger'
import { DebugConstants } from '../../utils/Constants'
import { Container, IContainer } from '../display/Container'
import { IDimension } from '../math/Dimension'
import { IRect, Rect } from '../math/Rect'
import { InteractiveContainerDebugger } from './InteractiveContainerDebugger'

export interface IInteractiveContainer extends IContainer, IUpdatable {
    interactiveBounds: IRect
    canInteract: boolean
    hasBeenInteracted: boolean
    interact(): Promise<any>
}

export interface InteractiveContainerOptions {
    interactKey?: Key
    interactiveBounds?: IDimension
    interactiveOffsetX?: number
    onInteract?: Function
    onEnter?: Function
    onExit?: Function
}

export class InteractiveContainer extends Container implements IInteractiveContainer {
    interactKey: Key
    currentInteractionPromise: Promise<any>
    player?: IClientPlayer
    debugger?: InteractiveContainerDebugger
    interactiveBounds: Rect
    canInteract: boolean = false
    hasBeenInteracted: boolean = false
    interactiveOffsetX: number = 0
    interactiveSimuRect: Rect
    onInteract?: Function
    onEnter?: Function
    onExit?: Function

    constructor(options?: InteractiveContainerOptions) {
        super()

        let width = 72
        let height = 64

        if (options !== undefined) {
            if (options.interactiveBounds !== undefined) {
                width = options.interactiveBounds.width
                height = options.interactiveBounds.height
            }
            if (options.interactKey !== undefined) {
                this.interactKey = options.interactKey

                this.applyKeyListener()
            }
            if (options.interactiveOffsetX !== undefined) {
                this.interactiveOffsetX = options.interactiveOffsetX
            }
            if (options.onInteract !== undefined) {
                this.onInteract = options.onInteract
            }
            if (options.onEnter !== undefined) {
                this.onEnter = options.onEnter
            }
            if (options.onExit !== undefined) {
                this.onExit = options.onExit
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
                this.enteredInteractZone(true)
            } else {
                this.enteredInteractZone(false)
            }
        } else {
            this.player = ClientPlayer.getInstance()
        }

        if (this.debugger !== undefined) {
            this.debugger.update()
        }
    }

    interact(): Promise<any> {
        Flogger.log('InteractiveContainer', 'interact')

        if (!this.canInteract) {
            Flogger.log('InteractiveContainer', 'Out of interaction range')
            
            return 
        }

        if (this.currentInteractionPromise == undefined) {
            this.currentInteractionPromise = new Promise(async (resolve) => {
                if (typeof this.onInteract === 'function') {
                    await this.onInteract()
                }
                
                this.hasBeenInteracted = true
                this.currentInteractionPromise = undefined

                resolve(true)
            })
        }

        return this.currentInteractionPromise
    }

    enteredInteractZone(entered: boolean) {
        if (entered && !this.canInteract) {
            if (this.onEnter !== undefined) {
                this.onEnter()
            }
        } else if (!entered && this.canInteract) {
            if (this.onExit !== undefined) {
                this.onExit()
            }
        }

        this.canInteract = entered
    }

    applyKeyListener() {
        InputProcessor.on(InputEvents.KeyDown, (event: KeyboardEvent) => {
            if (event.which === this.interactKey) {
                this.interact()
            }
        })
    }
}
