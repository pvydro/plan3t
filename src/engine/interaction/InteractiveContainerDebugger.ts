import { IUpdatable } from '../../interface/IUpdatable'
import { Container } from '../display/Container'
import { Graphix } from '../display/Graphix'
import { IInteractiveContainer } from './InteractiveContainer'

export interface IInteractiveContainerDebugger extends IUpdatable {

}

export interface InteractiveContainerDebuggerOptions {
    // interactiveRect: IRect
    container: IInteractiveContainer
}

export class InteractiveContainerDebugger extends Container implements IInteractiveContainerDebugger {
    debugGraphics: Graphix
    container: IInteractiveContainer
    
    constructor(options: InteractiveContainerDebuggerOptions) {
        super()

        this.container = options.container

        this.debugGraphics = new Graphix()
        this.debugGraphics.beginFill(0xfca103)
        this.debugGraphics.drawIRect(this.container.interactiveBounds)
        this.debugGraphics.endFill()

        this.addChild(this.debugGraphics)
    }

    update() {
        this.debugGraphics.x = this.container.interactiveBounds.x
        this.debugGraphics.y = this.container.interactiveBounds.y

        if (this.container.canInteract) {
            this.debugGraphics.alpha = 0.5
        } else {
            this.debugGraphics.alpha = 0.25
        }
    }
}
