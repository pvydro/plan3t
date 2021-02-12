import { Container } from '../../engine/display/Container'
import { Graphix } from '../../engine/display/Graphix'
import { IUpdatable } from '../../interface/IUpdatable'
import { Flogger } from '../../service/Flogger'
import { WindowSize } from '../../utils/Constants'
import { ICamera } from '../Camera'

export interface ICameraFlashPlugin extends IUpdatable {

}

export interface CameraFlashPluginOptions {
    camera: ICamera
}

export class CameraFlashPlugin extends Container implements ICameraFlashPlugin {
    camera: ICamera
    flashGraphic: Graphix

    constructor(options: CameraFlashPluginOptions) {
        super()

        this.camera = options.camera

        this.initializeFlashGraphics()
    }
    
    update() {
        if (this.flashGraphic.width !== WindowSize.width) this.flashGraphic.width = WindowSize.width
        if (this.flashGraphic.height !== WindowSize.height) this.flashGraphic.height = WindowSize.height
    }

    initializeFlashGraphics() {
        Flogger.log('CameraFlashPlugin', 'initializeFlashGraphics')

        this.flashGraphic = new Graphix()
        this.flashGraphic.beginFill(0xFFFFFF)
        this.flashGraphic.drawRect(0, 0, WindowSize.width, WindowSize.height)
        this.flashGraphic.endFill()
        this.flashGraphic.alpha = 0.5

        this.addChild(this.flashGraphic)
    }
}
