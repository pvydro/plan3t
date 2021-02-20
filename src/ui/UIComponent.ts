import { Container } from "pixi.js";
import { UIContainer, UIContainerOptions } from "./UIContainer";

export interface IUIComponent {
    show(): Promise<any>
    hide(): Promise<any>
    forceHide(): void
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
}
