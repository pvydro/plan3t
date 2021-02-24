import { Flogger } from '../../service/Flogger'
import { ICamera } from '../Camera'
import { CRTFilter } from 'pixi-filters'

export interface ICameraOverlayEffectsPlugin {

}

export class CameraOverlayEffectsPlugin implements ICameraOverlayEffectsPlugin {
    camera: ICamera

    constructor(camera: ICamera) {
        this.camera = camera

        this.initializeOverlayGraphics()
    }

    initializeOverlayGraphics() {
        Flogger.log('CameraOverlayEffectsPlugin', 'initializeOverlayGraphics')

        const crtFilter = new CRTFilter({
            curvature: 5,
            lineWidth: 5,
            lineContrast: 0.1
        })

        this.camera.stage.filters = [ crtFilter ]
    }
}
