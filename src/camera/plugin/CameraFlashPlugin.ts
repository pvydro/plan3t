import { Container } from '../../engine/display/Container'
import { Graphix } from '../../engine/display/Graphix'
import { IUpdatable } from '../../interface/IUpdatable'
import { Flogger } from '../../service/Flogger'
import { WindowSize } from '../../utils/Constants'
import { ICamera } from '../Camera'

export interface CameraFlashOptions {
    minimumBrightness?: number
    maximumBrightness?: number
    randomize?: boolean
}

export interface ICameraFlashPlugin extends IUpdatable {
    flash(options: CameraFlashOptions): void
}

export class CameraFlashPlugin extends Container implements ICameraFlashPlugin {
    camera: ICamera
    flashGraphic: Graphix
    fadeToBaseDivisor: number = 2

    constructor(camera: ICamera) {
        super()

        this.camera = camera

        this.initializeFlashGraphics()
    }
    
    update() {
        this.enforceFlashGraphicsSize()
        this.fadeFlashGraphicsToBase()
    }

    flash(options?: CameraFlashOptions) {
        Flogger.log('CameraFlashPlugin', 'flash')

        const shouldRandomize = options.randomize !== undefined ? options.randomize : true
        const maximum = options.maximumBrightness !== undefined ? options.maximumBrightness : 1
        const minimum = maximum - options.minimumBrightness
        const randomizer = shouldRandomize ? Math.random() : 1
        const newBrightness = (randomizer * minimum) + minimum

        Flogger.log('CameraFlashPlugin', 'maximum', maximum, 'minimum', minimum, 'newBrightness', newBrightness)

        this.flashGraphic.alpha = newBrightness
    }

    enforceFlashGraphicsSize() {
        if (this.flashGraphic.width !== WindowSize.width) this.flashGraphic.width = WindowSize.width
        if (this.flashGraphic.height !== WindowSize.height) this.flashGraphic.height = WindowSize.height
    }

    fadeFlashGraphicsToBase() {
        if (this.flashGraphic !== undefined
        && this.flashGraphic.alpha !== 0) {
            this.flashGraphic.alpha += (0 - this.flashGraphic.alpha) / this.fadeToBaseDivisor
        }

        if (this.flashGraphic.alpha < 0.01) this.flashGraphic.alpha = 0
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
