import * as PIXI from 'pixi.js'
import { Container } from '../engine/display/Container'

export interface IViewport {

}

export class Viewport extends Container implements IViewport {
    constructor() {
        super()
    }
}
