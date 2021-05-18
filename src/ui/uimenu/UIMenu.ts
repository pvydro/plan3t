import { IUIScreen, UIScreen, UIScreenOptions } from '../uiscreen/UIScreen'

export enum UIMenuSize {
    Small = 'Small',
    Medium = 'Medium',
    Large = 'Large',
    Fullscreen = 'Fullscreen'
}

export interface IUIMenu extends IUIScreen {

}

export interface UIMenuOptions extends UIScreenOptions {

}

export abstract class UIMenu extends UIScreen implements IUIScreen {
    constructor(options?: UIMenuOptions) {
        super(options)
    }
}
