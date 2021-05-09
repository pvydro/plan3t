import { Container } from '../../engine/display/Container'
import { Graphix } from '../../engine/display/Graphix'
import { IUpdatable } from '../../interface/IUpdatable'
import { log } from '../../service/Flogger'
import { UIComponent } from '../../ui/UIComponent'
import { GameWindow as GameWindow } from '../../utils/Constants'
import { ICamera } from '../Camera'

export interface CameraFlashOptions {
    minimumBrightness?: number
    maximumBrightness?: number
    randomize?: boolean
}

export interface ICameraFlashPlugin extends IUpdatable {
    flash(options: CameraFlashOptions): void
}

export class CameraFlashPlugin extends UIComponent implements ICameraFlashPlugin {
    camera: ICamera
    flashGraphic: Graphix
    fadeToBaseDivisor: number = 2

    constructor(camera: ICamera) {
        super()

        this.camera = camera

        this.initializeFlashGraphics()
        this.reposition(true)
    }
    
    update() {
        // this.enforceFlashGraphicsSize()
        this.fadeFlashGraphicsToBase()
    }

    flash(options?: CameraFlashOptions) {
        log('CameraFlashPlugin', 'flash')

        const shouldRandomize = options.randomize !== undefined ? options.randomize : true
        const maximum = options.maximumBrightness !== undefined ? options.maximumBrightness : 1
        const minimum = maximum - options.minimumBrightness
        const randomizer = shouldRandomize ? Math.random() : 1
        const newBrightness = (randomizer * maximum) + minimum

        log('CameraFlashPlugin', 'maximum', maximum, 'minimum', minimum, 'newBrightness', newBrightness)

        this.flashGraphic.alpha = newBrightness
    }

    // enforceFlashGraphicsSize() {
    //     if (this.flashGraphic.width !== GameWindow.width) this.flashGraphic.width = GameWindow.width
    //     if (this.flashGraphic.height !== GameWindow.height) this.flashGraphic.height = GameWindow.fullWindowHeight
    // }

    fadeFlashGraphicsToBase() {
        if (this.flashGraphic !== undefined
        && this.flashGraphic.alpha !== 0) {
            this.flashGraphic.alpha += (0 - this.flashGraphic.alpha) / this.fadeToBaseDivisor
        }

        if (this.flashGraphic.alpha < 0.01) this.flashGraphic.alpha = 0
    }

    initializeFlashGraphics() {
        log('CameraFlashPlugin', 'initializeFlashGraphics')

        this.flashGraphic = new Graphix()
        this.flashGraphic.beginFill(0xFFFFFF)
        this.flashGraphic.drawRect(0, 0, GameWindow.width, GameWindow.height)
        this.flashGraphic.endFill()
        this.flashGraphic.alpha = 0.5

        this.addChild(this.flashGraphic)
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        this.flashGraphic.height = GameWindow.fullWindowHeight
        this.flashGraphic.width = GameWindow.fullWindowWidth
        this.flashGraphic.y = GameWindow.y
    }
}
