import { Container } from 'pixi.js'
import { Graphix } from '../../engine/display/Graphix'
import { IVector2, Vector2 } from '../../engine/math/Vector2'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { Flogger } from '../../service/Flogger'
import { ShowCameraProjectionDebug } from '../../utils/Constants'
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

        if (ShowCameraProjectionDebug) {
            this.createDebugGraphics()
            this.applyMouseListener()
        }
    }

    update(x: number, y: number) {
        if (this.debugGraphics !== undefined) {
            this.debugPosition = this.camera.toScreen(new Vector2(x, y))
            this.debugGraphics.position.set(this.debugPosition.x, this.debugPosition.y)
        }
    }

    createDebugGraphics() {
        Flogger.log('CameraDebuggerPlugin', 'createDebugGraphics')

        this.debugGraphics = new Graphix()

        this.debugGraphics.beginFill(this.color)
        this.debugGraphics.drawRect(0, 0, 5, 5)
        this.debugGraphics.endFill()

        this.addChild(this.debugGraphics)
    }

    applyMouseListener() {
        Flogger.log('CameraDebuggerPlugin', 'applyMouseListener')

        InputProcessor.on(InputEvents.MouseMove, (ev: MouseEvent) => {
            this.update(ev.x - 2.5, ev.y - 2.5)
        })
    }
}
