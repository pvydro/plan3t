import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../../asset/Assets'
import { IUpdatable } from '../../../interface/IUpdatable'
import { asyncTimeout, exists } from '../../../utils/Utils'
import { Vector2 } from '../../math/Vector2'
import { Container } from '../Container'
import { Sprite } from '../Sprite'

export interface ILight extends IUpdatable {

}

export interface LightOptions {
    texture?: any
    shouldJitter?: boolean
    minimumJitterCooldown?: number
    maximumJitterCooldown?: number
    maximumJitterAmount?: number
    targetAlpha?: number
    delayUntilOn?: number
}

export class Light extends Container implements ILight {
    sprite: Sprite
    shakeDamping: number = 5
    jitterXCooldown: number = 10
    jitterYCooldown: number = 20
    minimumJitterCooldown: number = 200
    maximumJitterCooldown: number = 200
    maximumJitterAmount: number = 1
    delayUntilOn: number = 0
    targetAlpha?: number
    _isOn: boolean = true
    _reachedTargetAlpha: boolean = false
    _localPos: Vector2 = Vector2.Zero
    _targetJitterOffset: Vector2 = Vector2.Zero
    _jitterOffset: Vector2 = Vector2.Zero

    constructor(options?: LightOptions) {
        super()

        const texture = (options && options.texture) ? options.texture : PIXI.Texture.from(Assets.get(AssetUrls.LightHardLg))
        
        this.sprite = new Sprite({ texture })
        this.sprite.blendMode = PIXI.BLEND_MODES.ADD
        this.sprite.anchor.set(0.5, 0.5)

        this.minimumJitterCooldown = (options && options.minimumJitterCooldown) ? options.minimumJitterCooldown : this.minimumJitterCooldown
        this.maximumJitterCooldown = (options && options.maximumJitterCooldown) ? options.maximumJitterCooldown : this.maximumJitterCooldown
        this.maximumJitterAmount = (options && options.maximumJitterAmount) ? options.maximumJitterAmount : this.maximumJitterAmount

        this.addChild(this.sprite)

        if (options) {
            if (exists(options.targetAlpha)) {
                this.targetAlpha = options.targetAlpha
            }
            if (exists(options.delayUntilOn)) {
                this.delayUntilOn = options.delayUntilOn
                this._isOn = false

                asyncTimeout(this.delayUntilOn).then(() => {
                    this._isOn = true
                })
            }
        }
    }

    update() {
        this.updateShake()

        this.sprite.x = this._localPos.x + this._jitterOffset.x
        this.sprite.y = this._localPos.y + this._jitterOffset.y

        if (this.isOn) {
            if (!this.hasReachedTargetAlpha && this.targetAlpha !== undefined) {
                this.alpha += ((this.targetAlpha - this.alpha) / 20) / 5
    
                if (this.alpha > this.targetAlpha - 0.001) {
                    this.alpha = this.targetAlpha
                    this._reachedTargetAlpha = true
                }
            }
        }
    }

    updateShake() {
        this._jitterOffset.x += (this._targetJitterOffset.x - this._jitterOffset.x) / this.shakeDamping
        this._jitterOffset.y += (this._targetJitterOffset.y - this._jitterOffset.y) / this.shakeDamping

        this.jitterXCooldown--
        this.jitterYCooldown--

        if (this.jitterXCooldown <= 0) {
            this.jitterXCooldown = (Math.random() * this.maximumJitterCooldown) + this.minimumJitterCooldown

            this._targetJitterOffset.x = Math.random() * this.maximumJitterAmount
        }
        if (this.jitterYCooldown <= 0) {
            this.jitterXCooldown = (Math.random() * this.maximumJitterCooldown) + this.minimumJitterCooldown

            this._targetJitterOffset.y = Math.random() * this.maximumJitterAmount
        }
    }

    get hasReachedTargetAlpha() {
        return this._reachedTargetAlpha
    }

    get isOn() {
        return this._isOn
    }
}
