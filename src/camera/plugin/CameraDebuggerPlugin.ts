import { Container } from 'pixi.js'
import { Graphix } from '../../engine/display/Graphix'
import { IVector2, Vector2 } from '../../engine/math/Vector2'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { Flogger } from '../../service/Flogger'
import { DebugConstants } from '../../utils/Constants'
import { ICamera } from '../Camera'

export interface ICameraDebuggerPlugin {

}

export class CameraDebuggerPlugin extends Container implements ICameraDebuggerPlugin {
    camera: ICamera
    toScreenGraphics: Graphix
    color: number = 0x60b5b2
    lineWidth: number = 1
    toScreenDebugPosition: IVector2 = Vector2.Zero

    constructor(camera: ICamera) {
        super()
        this.camera = camera

        if (DebugConstants.ShowCameraProjectionDebug) {
            this.createDebugGraphics()
            this.applyMouseListener()
        }
    }

    update(x: number, y: number) {
        if (this.toScreenGraphics !== undefined) {
            this.toScreenDebugPosition = this.camera.toScreen(new Vector2(x, y))
            this.toScreenGraphics.position.set(this.toScreenDebugPosition.x, this.toScreenDebugPosition.y)
        }
    }

    createDebugGraphics() {
        Flogger.log('CameraDebuggerPlugin', 'createDebugGraphics')

        this.toScreenGraphics = new Graphix()

        this.toScreenGraphics.beginFill(this.color)
        this.toScreenGraphics.drawRect(0, 0, 5, 5)
        this.toScreenGraphics.endFill()

        this.addChild(this.toScreenGraphics)
    }

    applyMouseListener() {
        Flogger.log('CameraDebuggerPlugin', 'applyMouseListener')

        InputProcessor.on(InputEvents.MouseMove, (ev: MouseEvent) => {
            this.update(ev.x - 2.5, ev.y - 2.5)
        })
    }
}
