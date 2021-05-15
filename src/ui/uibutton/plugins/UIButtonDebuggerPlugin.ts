import { Container } from '../../../engine/display/Container'
import { Graphix } from '../../../engine/display/Graphix'
import { IUIButton } from '../UIButton'

export interface IUIButtonDebuggerPlugin {
    initialize(): void
}

export class UIButtonDebuggerPlugin extends Container implements IUIButtonDebuggerPlugin {
    button: IUIButton

    constructor(button: IUIButton) {
        super()

        this.button = button        
    }

    initialize() {
        const graphics = new Graphix()

        graphics.beginFill(0xa632a8)
        graphics.drawRect(0, 0, this.button.dimension.width, this.button.dimension.height)
        graphics.endFill()

        this.addChild(graphics)
    }
}
