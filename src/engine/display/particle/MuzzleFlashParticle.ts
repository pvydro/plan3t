import { AssetUrls } from '../../../asset/Assets'
import { GlobalScale } from '../../../utils/Constants'
import { AnimatedSprite } from '../AnimatedSprite'
import { IParticle, Particle, ParticleOptions, ParticlePositioningOptions } from './Particle'

export interface IMuzzleFlashParticle extends IParticle {

}

export class MuzzleFlashParticle extends Particle implements IMuzzleFlashParticle {
    private static aTextures = [ AssetUrls.MUZZLE_FLASH_A_0, AssetUrls.MUZZLE_FLASH_A_1, AssetUrls.MUZZLE_FLASH_A_2, AssetUrls.MUZZLE_FLASH_A_3, ]
    private static bTextures = [ AssetUrls.MUZZLE_FLASH_B_0, AssetUrls.MUZZLE_FLASH_B_1, AssetUrls.MUZZLE_FLASH_B_2, AssetUrls.MUZZLE_FLASH_B_3, ]
    private static cTextures = [ AssetUrls.MUZZLE_FLASH_C_0, AssetUrls.MUZZLE_FLASH_C_1, AssetUrls.MUZZLE_FLASH_C_2, AssetUrls.MUZZLE_FLASH_C_3, ]
    private static dTextures = [ AssetUrls.MUZZLE_FLASH_D_0, AssetUrls.MUZZLE_FLASH_D_1, AssetUrls.MUZZLE_FLASH_D_2, AssetUrls.MUZZLE_FLASH_D_3, ] // TODO Automate this :facepalm:
    private static textureArrays = [ 
        MuzzleFlashParticle.aTextures, 
        MuzzleFlashParticle.bTextures, 
        MuzzleFlashParticle.cTextures,
        MuzzleFlashParticle.dTextures
    ]

    constructor(options?: ParticlePositioningOptions) {
        const sprite = new AnimatedSprite({
            textureUrls: MuzzleFlashParticle.RandomAnimation,
            animationSpeed: 0.25,
        })

        sprite.anchor.set(0, 0.5)
        sprite.play()
        sprite.onComplete = () => {
            this.demolish()
        }

        const op = (options as ParticleOptions)
        op.sprite = sprite

        super(op)

        this.scale.set(GlobalScale, GlobalScale)
    }

    static get RandomAnimation(): string[] {
        const finalTextures = []

        for (let i = 0; i < 4; i++) {
            const selectedArray = Math.floor(Math.random() * 4)

            const chosenTexture = MuzzleFlashParticle.textureArrays[selectedArray][i]

            finalTextures.push(chosenTexture)
        }

        return finalTextures
    }
}
