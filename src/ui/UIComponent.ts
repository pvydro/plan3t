import { Container } from "pixi.js";
import { UIContainer, UIContainerOptions } from "./UIContainer";

export interface IUIComponent {
    forceHide(): void
}

export interface UIComponentOptions extends UIContainerOptions {

}

export class UIComponent extends UIContainer implements IUIComponent {
    constructor(options?: UIComponentOptions) {
        super(options)
    }

    forceHide() {
    }
}
