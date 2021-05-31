import * as PIXI from 'pixi.js'
import { InputEvents, InputProcessor } from '../input/InputProcessor'
import { IReposition } from '../interface/IReposition'
import { IShowHide, ShowOptions } from '../interface/IShowHide'
import { IUpdatable } from '../interface/IUpdatable'
import { asyncTimeout } from '../utils/Utils'
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
    middleX: number
    middleY: number
    bottom: number
    top: number
    left: number
    right: number

    forceHide(): void
    demolish(): void
    showFor(time: number, options?: ShowOptions): Promise<void>
}

export interface UIComponentOptions extends UIContainerOptions {
    borderOptions?: UIComponentBorderOptions
    filters?: PIXI.Filter[]
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
            if (options.filters) {
                this.filters = options.filters
            }
        }
    }

    forceHide() {
        this._isShown = false
        this.alpha = 0
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

    async showFor(time: number, showOptions?: ShowOptions) {
        await this.show(showOptions)
        await asyncTimeout(time)
        await this.hide()
    }
    
    async show(options?: ShowOptions) {
        this._isShown = true
    }

    async hide() {
        this._isShown = false
    }

    get isShown() {
        return this._isShown
    }

    get left() {
        return 0
    }

    get middleX() {
        return 0 + this.halfWidth
    }

    get right() {
        return 0 + this.width
    }

    get top() {
        return 0
    }

    get middleY() {
        return 0 + this.halfHeight
    }

    get bottom() {
        return 0 + this.height
    }
}
