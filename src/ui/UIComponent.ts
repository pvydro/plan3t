import { InputEvents, InputProcessor } from '../input/InputProcessor'
import { IReposition } from '../interface/IReposition'
import { IShowHide } from '../interface/IShowHide'
import { IUpdatable } from '../interface/IUpdatable'
import { UIComponentBorder, UIComponentBorderOptions } from './UIComponentBorder'
import { UIContainer, UIContainerOptions } from './UIContainer'

export interface IUIComponent extends IUpdatable, IShowHide, IReposition {
    name: string 
    accessible: boolean
    accessibleChildren: boolean
    alpha: number
    angle: number
    buttonMode: boolean
    cacheAsBitmap: boolean
    rotation: number
    x: number
    y: number
    width: number
    height: number
    isShown: boolean
    forceHide(): void
    demolish(): void
}

export interface UIComponentOptions extends UIContainerOptions {
    borderOptions?: UIComponentBorderOptions
}

export class UIComponent extends UIContainer implements IUIComponent {
    _isShown: boolean
    border?: UIComponentBorder

    constructor(options?: UIComponentOptions) {
        super(options)

        if (options !== undefined) {
            if (options.borderOptions !== undefined) {
                this.border = new UIComponentBorder(options.borderOptions)

                this.addChild(this.border)
            }
        }
    }

    forceHide() {
        this._isShown = false
    }

    reposition(addListener?: boolean) {
        if (addListener) {
            InputProcessor.on(InputEvents.Resize, () => {
                this.reposition(false)
            })
        }
    }

    demolish(): void {
        this.destroy()
    }
    
    async show() {
        this._isShown = true
    }

    async hide() {
        this._isShown = false
    }

    get isShown() {
        return this._isShown
    }
}
