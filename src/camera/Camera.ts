import { WindowSize, WorldSize } from '../utils/Constants'
import * as Viewport from 'pixi-viewport'

export interface ICamera {
    viewport: Viewport
}

export class Camera implements ICamera {
    _viewport: Viewport

    constructor() {
        this._viewport = new Viewport({
            screenWidth: WindowSize.width,
            screenHeight: WindowSize.height,
            worldWidth: WorldSize.width,
            worldHeight: WorldSize.height
        })
    }

    get viewport() {
        return this._viewport
    }
}