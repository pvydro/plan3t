import { Container } from 'pixi.js'
import { Graphix } from '../../engine/display/Graphix'
import { IVector2, Vector2 } from '../../engine/math/Vector2'
import { InputProcessor } from '../../input/InputProcessor'
import { ICamera } from '../Camera'

export interface ICameraDebuggerPlugin {

}

export interface CameraDebuggerOptions {
    camera: ICamera
}

export class CameraDebuggerPlugin extends Container implements ICameraDebuggerPlugin {
    camera: ICamera
    debugGraphics: Graphix
    color: number = 0x60b5b2
    lineWidth: number = 1
    debugPosition: IVector2 = Vector2.Zero

    constructor(options: CameraDebuggerOptions) {
        super()
        this.camera = options.camera

        this.debugGraphics = new Graphix()

        this.debugGraphics.beginFill(this.color)
        this.debugGraphics.drawRect(0, 0, 5, 5)
        this.debugGraphics.endFill()

        InputProcessor.on('mousemove', (ev) => {
            this.update(ev.x - 2.5, ev.y - 2.5)
        })

        this.addChild(this.debugGraphics)
    }

    update(x: number, y: number) {
        this.debugPosition = this.camera.toScreen(new Vector2(x, y))
        this.debugGraphics.position.set(this.debugPosition.x, this.debugPosition.y)
    }
}
