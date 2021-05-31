export interface ShowOptions {
    delay?: number
}

export interface IShowHide {
    show(options?: ShowOptions): Promise<any>
    hide(options?: ShowOptions): Promise<any>
}
