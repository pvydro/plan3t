import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { IUpdatable } from '../../interface/IUpdatable'
import { ICamera } from '../Camera'

export interface ICameraPlayerSynchPlugin extends IUpdatable {

}

export class CameraPlayerSynchPlugin implements ICameraPlayerSynchPlugin {
    camera: ICamera
    xVelOffsetDivisor = 150//30
    xVelOffsetMultiplier: number = 85//40//15
    xVelOffset: number = 0
    targetXVelOffset: number = 0
    // maximumXVel: number = 0

    constructor(camera: ICamera) {
        this.camera = camera
    }

    update() {
        if (this.target) {
            const playerTarget = (this.target as ClientPlayer)
            const playerDirection = (playerTarget && playerTarget.direction) ?? 1
            
            this.targetXVelOffset = (this.target.xVel * this.xVelOffsetMultiplier)
            this.targetXVelOffset = this.targetXVelOffset < 0 ? Math.abs(this.targetXVelOffset) : this.targetXVelOffset
            this.targetXVelOffset *= playerDirection

            this.xVelOffset += (this.targetXVelOffset - this.xVelOffset) / this.xVelOffsetDivisor

            this.camera.extraXOffset = this.xVelOffset
        }
    }

    get target() {
        return this.camera.target
    }
}
