import { Container } from '../display/Container'
import { Graphix } from '../display/Graphix'
import { IRect } from '../math/Rect'

export interface IInteractiveContainerDebugger {

}

export interface InteractiveContainerDebuggerOptions {
    interactiveRect: IRect
}

export class InteractiveContainerDebugger extends Container {
    debugGraphics: Graphix
    
    constructor(options: InteractiveContainerDebuggerOptions) {
        super()

        this.debugGraphics = new Graphix()

        this.debugGraphics.beginFill(0xfca103)
        this.debugGraphics.drawIRect(options.interactiveRect)
        this.debugGraphics.endFill()
        this.debugGraphics.alpha = 0.25

        this.addChild(this.debugGraphics)
    }
}
