import { Container, IContainer } from '../engine/display/Container'
import { ICameraStage } from './CameraStage'

export interface ICameraStageBackground extends IContainer {

}

export interface CameraStageBackgroundOptions {
    cameraStage: ICameraStage
}

export class CameraStageBackground extends Container implements ICameraStageBackground {
    cameraStage: ICameraStage

    constructor(options: CameraStageBackgroundOptions) {
        super()

        this.cameraStage = options.cameraStage
    }
}
