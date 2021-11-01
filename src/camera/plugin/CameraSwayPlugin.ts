import { ClientPlayer, IClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { IVector2, Vector2 } from '../../engine/math/Vector2'
import { IUpdatable } from '../../interface/IUpdatable'
import { ICamera } from '../Camera'

export interface ICameraSwayPlugin extends IUpdatable {

}

export class CameraSwayPlugin implements ICameraSwayPlugin {
    camera: ICamera
    targetOffset: IVector2 = Vector2.Zero
    offset: IVector2 = Vector2.Zero
    _targetJitterOffset: IVector2 = Vector2.Zero
    _jitterOffset: IVector2 = Vector2.Zero
    jitterDamping: number = 100
    jitterXCooldown: number = 10
    jitterYCooldown: number = 20
    maximumJitterCooldown: number = 500
    maximumJitterAmount: number = 30
    // player: IClientPlayer

    constructor(camera: ICamera) {
        this.camera = camera

        // const isOnPlayer = (typeof this.camera.target) === (typeof ClientPlayer.getInstance())
        // if (isOnPlayer) this.player = this.camera.target as ClientPlayer
        // this.player = C
    }
    
    update() {
        const headBobAmt = ClientPlayer.getInstance()
            ?.getPlayerHead().headBobOffsetInterpoliation.interpolation ?? 0

        // this._jitterOffset.x += (this._targetJitterOffset.x - this._jitterOffset.x) / this.jitterDamping
        // this._jitterOffset.y += (this._targetJitterOffset.y - this._jitterOffset.y) / this.jitterDamping

        this.jitterXCooldown--
        this.jitterYCooldown--

        if (this.jitterXCooldown <= 0) {
            // this.jitterXCooldown = Math.random() * this.maximumJitterCooldown

            // this._targetJitterOffset.x = Math.random() * (this.maximumJitterAmount)
        }
        if (this.jitterYCooldown <= 0) {
            // this.jitterYCooldown = Math.random() * this.maximumJitterCooldown

            // this._targetJitterOffset.y = (Math.random() * (this.maximumJitterAmount / 2))
            //     + (headBobAmt * 30)
            // this._targetJitterOffset.y = headBobAmt * 30 
        }

        // this._jitterOffset.y += headBobAmt
        // console.log(headBobAmt)

        // Update camera offsets
        this.camera.transformOffset.x = 0//this._jitterOffset.x
        this.camera.transformOffset.y = -headBobAmt / 3//this._jitterOffset.y//(this._jitterOffset.y - this.camera.transformOffset.y) / this.jitterDamping
    }
}
