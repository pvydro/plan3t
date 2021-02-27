import { Flogger } from '../../service/Flogger'
import { ICamera } from '../Camera'
import { CRTFilter, GlitchFilter } from 'pixi-filters'

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

        const colorMatrixFilter = new PIXI.filters.ColorMatrixFilter()
        const crtFilter = new CRTFilter({
            curvature: 2,
            noise: 0.01,
            lineWidth: 3,
            lineContrast: 0.05
        })
        
        colorMatrixFilter.polaroid(true)
        
        this.camera.stage.filters = [
            // crtFilter,
            colorMatrixFilter
        ]
    }
}
