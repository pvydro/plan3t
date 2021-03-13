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

    constructor(camera: ICamera) {
        this.camera = camera
    }
    
    update() {
        this._jitterOffset.x += (this._targetJitterOffset.x - this._jitterOffset.x) / this.jitterDamping
        this._jitterOffset.y += (this._targetJitterOffset.y - this._jitterOffset.y) / this.jitterDamping

        this.jitterXCooldown--
        this.jitterYCooldown--

        if (this.jitterXCooldown <= 0) {
            this.jitterXCooldown = Math.random() * this.maximumJitterCooldown

            this._targetJitterOffset.x = Math.random() * (this.maximumJitterAmount)
        }
        if (this.jitterYCooldown <= 0) {
            this.jitterYCooldown = Math.random() * this.maximumJitterCooldown

            this._targetJitterOffset.y = Math.random() * (this.maximumJitterAmount / 2)
        }

        // Update camera offsets
        this.camera.transformOffset.x += (this._jitterOffset.x - this.camera.transformOffset.x ) / this.jitterDamping
        this.camera.transformOffset.y = (this._jitterOffset.y - this.camera.transformOffset.y) / this.jitterDamping
    }
}
