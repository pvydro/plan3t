import { IUpdatable } from '../../interface/IUpdatable'
import { ICamera } from '../Camera'

export interface ICameraPlayerSynchPlugin extends IUpdatable {

}

export class CameraPlayerSynchPlugin implements ICameraPlayerSynchPlugin {
    camera: ICamera
    xVelOffsetDivisor = 100//150//30
    xVelOffsetMultiplier: number = 85//40//15
    xVelOffset: number = 0
    targetXVelOffset: number = 0
    // maximumXVel: number = 0

    constructor(camera: ICamera) {
        this.camera = camera
    }

    update() {
        if (this.target) {
            this.targetXVelOffset = (this.target.xVel * this.xVelOffsetMultiplier)
            this.xVelOffset += (this.targetXVelOffset - this.xVelOffset) / this.xVelOffsetDivisor

            this.camera.extraXOffset = this.xVelOffset
        }
    }

    get target() {
        return this.camera.target
    }
}
