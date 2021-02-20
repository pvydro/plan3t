import { Container } from "pixi.js";
import { IShowHide } from '../interface/IShowHide'
import { UIContainer, UIContainerOptions } from './UIContainer'

export interface IUIComponent extends IShowHide {
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

}

export class UIComponent extends UIContainer implements IUIComponent {
    _isShown: boolean

    constructor(options?: UIComponentOptions) {
        super(options)
    }

    forceHide() {
        this._isShown = false
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

    demolish(): void {
        this.destroy()
    }
}
