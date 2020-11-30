import * as PIXI from 'pixi.js'

export interface IContainer {

}

export class Container extends PIXI.Container {
    constructor() {
        super()
    }

    // addChild<T extends IUIDisplayComponent>(...children: Array<T>) {
    //     children.forEach((displayComponent: IUIDisplayComponent) => {
    //         this.container.addChild(displayComponent.component)
    //     })
    // }

    // removeChild<T extends IUIDisplayComponent>(...children: Array<T>) {
    //     children.forEach((displayComponent: IUIDisplayComponent) => {
    //         this.container.removeChild(displayComponent.component)
    //     })
    // }

}