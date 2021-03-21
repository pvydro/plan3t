import { Container } from '../engine/display/Container'
import { Graphix } from '../engine/display/Graphix'
import { Flogger } from '../service/Flogger'
import { IUIComponent } from './UIComponent'

export interface IUIComponentBorder {

}

export interface UIComponentBorderOptions {
    component?: IUIComponent
    color?: number
    borderWidth?: number
    height?: number
}

export class UIComponentBorder extends Container {
    // component?: IUIComponent
    borderHeight: number
    borderGraphics: Graphix
    borderWidth: number
    color: number

    constructor(options: UIComponentBorderOptions) {
        super()

        // this.component = options.component
        this.borderHeight = options.height ? options.height : (options.component ? options.component.height : 64)
        this.borderWidth = options.borderWidth ?? 1
        this.color = options.color ?? 0xFFFFFF

        this.createBorder(options)
    }

    createBorder(options: UIComponentBorderOptions) {
        if (this.borderGraphics !== undefined) {
            this.removeChild(this.borderGraphics)
        }

        this.borderGraphics = new Graphix()
        this.borderGraphics.beginFill(this.color)
        this.borderGraphics.drawRect(0, 0, this.borderWidth, this.borderHeight)
        this.borderGraphics.endFill()
        
        this.addChild(this.borderGraphics)
    }
}
