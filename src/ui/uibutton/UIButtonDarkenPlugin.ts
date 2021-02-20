import { IUIButton } from "./UIButton";

export interface IUIButtonDarkenPlugin {

}

export interface UIButtonDarkenPluginOptions {
    
}

export class UIButtonDarkenPlugin implements IUIButtonDarkenPlugin {
    button: IUIButton

    constructor(button: IUIButton) {
        this.button = button
    }
}
