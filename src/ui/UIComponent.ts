import * as PIXI from 'pixi.js'
import { ISprite, Sprite } from '../engine/display/Sprite'
import { Tween } from '../engine/display/tween/Tween'
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
    sprite?: Sprite
}

export class UIComponent extends UIContainer implements IUIComponent {
    _isShown: boolean
    border?: UIComponentBorder
    _currentShowTimeout: number
    _sprite: ISprite

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
            if (options.sprite) {
                this.addChild(options.sprite)
                this._sprite = options.sprite
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

        if (options?.delay) {
            this.delayShow(options.delay).then(() => {
                this.show()
            })

            return
        }

        await Tween.to(this, { alpha: 1, duration: 0.5, autoplay: true })
    }

    async hide(options?: ShowOptions) {
        this._isShown = false

        if (options?.delay) {
            this.delayShow(options.delay).then(() => {
                this.hide()
            })

            return
        }

        await Tween.to(this, { alpha: 0, duration: 0.5, autoplay: true })
    }

    protected delayShow(time: number): Promise<void> {
        return new Promise((resolve) => {
            this.currentShowTimeout = window.setTimeout(() => {
                this.currentShowTimeout = undefined
                resolve()
            }, time)
        })
    }

    private set currentShowTimeout(value: number) {
        if (this._currentShowTimeout) {
            window.clearTimeout(this._currentShowTimeout)
        }

        this._currentShowTimeout = value
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
