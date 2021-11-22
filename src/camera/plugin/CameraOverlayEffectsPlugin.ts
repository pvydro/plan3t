import { Flogger } from '../../service/Flogger'
import { ICamera } from '../Camera'
import { CRTFilter } from 'pixi-filters'
import { Filters } from '../../utils/Filters'

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

        const colorMatrixFilter = Filters.getColorMatrixFilter({
            vintage: true,
            polaroid: true,
            brightness: 1.15,
        })
        const crtFilter = new CRTFilter({
            curvature: 2.5,
            noise: 0.01,
            lineWidth: 3,
            lineContrast: 0.025,
            vignetting: 0
        })

        
        // colorMatrixFilter.greyscale(0.35, false)
        // colorMatrixFilter.vintage(true)
        // colorMatrixFilter.polaroid(true)    
        // colorMatrixFilter.blackAndWhite(true)
        // colorMatrixFilter.desaturate()
        // colorMatrixFilter.night(0.35, true)
        
        // this.camera.viewport.filters = [
        //     crtFilter,
        //     colorMatrixFilter
        // ]

        this.camera.stage.filters = [
            crtFilter,
            colorMatrixFilter
        ]
    }
}
