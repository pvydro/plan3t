import * as PIXI from 'pixi.js'
import { Container } from '../engine/display/Container'
import { Sprite } from '../engine/display/Sprite'
import { IUpdatable } from '../interface/IUpdatable'
import { GameWindow } from '../utils/Constants'

export interface IUIContainer extends IUpdatable {

}

export interface UIContainerOptions {
    width?: number
    height?: number
    shouldFillWindow?: boolean
}

export class UIContainer extends Container implements IUIContainer {
    _containerFillSprite?: Sprite
    _containerWidth: number = 256
    _containerHeight: number = 256
    _shouldFillWindow: boolean = false

    constructor(options?: UIContainerOptions) {
        super()

        if (options) {
            if (options.width && options.height) {
                this._containerWidth = options.width
                this._containerHeight = options.height
                this.applyContainerEmptyFill()
            }
            if (options.shouldFillWindow) {
                this._shouldFillWindow = options.shouldFillWindow
                this.applyContainerEmptyFill()
            }
        }
    }

    update() {
        if (this._shouldFillWindow) {
            if (this._containerWidth !== GameWindow.width
            || this._containerHeight !== GameWindow.height) {
                this._containerWidth = GameWindow.width
                this._containerHeight = GameWindow.height

                this.applyContainerEmptyFill()
            }
        }
    }

    applyContainerEmptyFill() {
        if (this._containerFillSprite === undefined) {
            this._containerFillSprite = new Sprite({ texture: PIXI.Texture.EMPTY })

            this.addChild(this._containerFillSprite)
        }
        
        this._containerFillSprite.width = this._containerWidth
        this._containerFillSprite.height = this._containerHeight
        this._containerFillSprite.position.set(0, 0)
    }
}
