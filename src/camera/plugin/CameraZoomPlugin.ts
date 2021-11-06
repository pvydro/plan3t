import { ICamera } from '../Camera'

export interface ICameraZoomPlugin {

}

export class CameraZoomPlugin implements ICameraZoomPlugin {
    camera: ICamera

    constructor(camera: ICamera) {
        this.camera = camera
    }

    
}
