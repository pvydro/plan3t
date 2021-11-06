import { Camera } from '../camera/Camera'
import { MuzzleFlashParticle } from '../engine/display/particle/MuzzleFlashParticle'
import { Direction } from '../engine/math/Direction'
import { particleMan } from '../shared/Dependencies'
import { GlobalScale } from '../utils/Constants'
import { Weapon } from './Weapon'

export interface IWeaponEffects {
    addMuzzleFlash(): void
    applyScreenEffects(): void
}

export interface WeaponEffectsOptions {
    weapon: Weapon
}

export class WeaponEffects implements IWeaponEffects {
    weapon: Weapon

    constructor(options: WeaponEffectsOptions) {
        this.weapon = options.weapon
    }

    addMuzzleFlash() {
        const player = this.playerHolster ? this.playerHolster.player : undefined
        const playerHand = player ? player.hand : undefined
        const handRotation = playerHand ? playerHand.rotation : undefined
        let rotation = handRotation ? handRotation : this.rotation

        if (player && this.sprite) {
            rotation *= player.direction

            const referenceX = player.x + this.weapon.x
            const referenceY = player.y + (this.weapon.y * GlobalScale)
            const handRotationX = playerHand ? playerHand.rotationContainer.x : 0
            const halfWidth = (this.sprite.halfWidth * GlobalScale) + (handRotationX * GlobalScale)
            const halfHeight = (-this.sprite.halfHeight * GlobalScale)
                + (this.barrelOffsetY * GlobalScale)

            const handSpriteX = playerHand.handSprite.x * GlobalScale
            const handX = handSpriteX * player.direction

            let distanceX = (halfWidth * Math.cos(rotation)) - (halfHeight * Math.sin(rotation))
            let distanceY = (halfWidth * Math.sin(rotation)) + (halfHeight * Math.cos(rotation))
            let translatedX = referenceX + (distanceX * player.direction) + handX
            let translatedY = referenceY + (distanceY * 1.1)
            translatedX += (this.handPushAmount * GlobalScale) * player.direction
            translatedY += (this.handDropAmount * GlobalScale)
            
            this.weapon._currentRotatedBarrelPoint = {
                x: translatedX, y: translatedY
            }
            
            const particle = new MuzzleFlashParticle({
                position: { x: translatedX, y: translatedY },
                rotation: rotation * player.direction
            })

            if (player.direction === Direction.Left) {
                particle.scale.x = (particle.scale.x * -1)
            }

            particleMan.addParticle(particle)
        }
    }

    applyScreenEffects() {
        const camera = Camera.getInstance()

        camera.shake(1.25)
        camera.flash({
            minimumBrightness: 0.15,
            maximumBrightness: 0.3
        })
    }
    
    get rotation() {
        return this.weapon.rotation
    }

    get sprite() {
        return this.weapon.sprite
    }

    get barrelOffsetY() {
        return this.weapon.barrelOffsetY
    }

    get handPushAmount() {
        return this.weapon.handPushAmount
    }

    get handDropAmount() {
        return this.weapon.handDropAmount
    }

    get playerHolster() {
        return this.weapon.playerHolster
    }
}
