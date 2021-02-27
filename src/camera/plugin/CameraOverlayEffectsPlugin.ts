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
            curvature: 2,
            noise: 0.01,
            lineWidth: 3,
            lineContrast: 0.05
        })

        this.camera.stage.filters = [ crtFilter ]
    }
}
