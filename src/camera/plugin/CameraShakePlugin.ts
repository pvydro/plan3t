import { IVector2, Vector2 } from '../../engine/math/Vector2'
import { IUpdatable } from '../../interface/IUpdatable'
import { ICamera } from '../Camera'

export interface ICameraShakePlugin extends IUpdatable {
    shake(amount: number): void
}

export class CameraShakePlugin implements ICameraShakePlugin {
    camera: ICamera
    _targetScreenShakeOffset: IVector2 = Vector2.Zero
    _screenShakeOffset: IVector2 = Vector2.Zero
    screenShakeDamping: number = 1.5
    screenShakeRecoveryDamping: number = 5
    maximumShakeAmount: number = 1//2

    constructor(camera: ICamera) {
        this.camera = camera
    }

    update() {
        this._screenShakeOffset.x += (this._targetScreenShakeOffset.x - this._screenShakeOffset.x) / this.screenShakeDamping
        this._screenShakeOffset.y += (this._targetScreenShakeOffset.y - this._screenShakeOffset.y) / this.screenShakeDamping

        this._targetScreenShakeOffset.x += (0 - this._targetScreenShakeOffset.x) / this.screenShakeRecoveryDamping
        this._targetScreenShakeOffset.y += (0 - this._targetScreenShakeOffset.y) / this.screenShakeRecoveryDamping

        this.camera.instantOffset = this._screenShakeOffset
    }

    shake(amount: number) {
        const maximumShake = this.maximumShakeAmount * amount

        this._targetScreenShakeOffset.x = (Math.random() * maximumShake)
        this._targetScreenShakeOffset.y = (Math.random() * maximumShake)
        this._targetScreenShakeOffset.x *= (Math.random() > 0.5) ? 1 : -1
        this._targetScreenShakeOffset.y *= (Math.random() > 0.5) ? 1 : -1
    }
}
