import * as PIXI from 'pixi.js'
import { IDemolishable } from '../../interface/IDemolishable'
import { IUIContainer } from '../../ui/UIContainer'
import { IDimension } from '../math/Dimension'
import { IVector2 } from '../math/Vector2'

export interface IContainer extends IDemolishable {
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
    pos: IVector2 | number
    clearChildren(): void
}

export class Container extends PIXI.Container implements IContainer {
    constructor() {
        super()
    }

    clearChildren() {
        for (var i in this.children) {
            const child = this.children[i]

            this.removeChild(child)
            child.destroy()
        }
    }

    addChild<TChildren extends PIXI.DisplayObject[] | IUIContainer[]>(...children: TChildren): TChildren[0] {
        super.addChild(...children as PIXI.DisplayObject[])
        return children[0]
    }

    removeChild<TChildren extends PIXI.DisplayObject[] | IUIContainer[]>(...children: TChildren): TChildren[0] {
        super.removeChild(...children as PIXI.DisplayObject[])
        return children[0]
    }

    hasChild(child: any) {
        let contains = false

        for (var i in this.children) {
            const childToCheckAgainst = this.children[i]

            if (child === childToCheckAgainst) {
                contains = true
            }
        }

        return contains
    }

    set pos(value: IVector2 | number) {
        if (typeof value === 'number') {
            value = { x: value, y: value }
        }
        this.position.x = value.x
        this.position.y = value.y
    }

    get pos() {
        return this.position
    }

    set dimension(value: IDimension) {
        this.width = value.width
        this.height = value.height
    }

    get halfWidth() {
        return this.width / 2
    }

    get halfHeight() {
        return this.height / 2
    }

    demolish(): void {

    }
}
