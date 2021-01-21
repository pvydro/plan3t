import * as PIXI from 'pixi.js'
import { Container } from '../engine/display/Container'
import { Vector2 } from '../engine/math/Vector2'

export interface IViewport {

}

export class Viewport extends Container implements IViewport {
    constructor() {
        super()
    }

    toScreen(point: Vector2 | PIXI.ObservablePoint) {
        return point
    }
}
