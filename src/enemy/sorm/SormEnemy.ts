import { Key } from 'ts-keycode-enum'
import { Assets, AssetUrls } from '../../asset/Assets'
import { SpritesheetUrls } from '../../asset/Spritesheets'
import { CreatureType } from '../../creature/CreatureType'
import { Sprite } from '../../engine/display/Sprite'
import { Spritesheet } from '../../engine/display/spritesheet/Spritesheet'
import { Direction } from '../../engine/math/Direction'
import { Rect } from '../../engine/math/Rect'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { Enemy, IEnemy } from '../Enemy'

export interface ISormEnemy extends IEnemy {

}

export class SormEnemy extends Enemy implements ISormEnemy {
    _boundingBox?: Rect

    constructor() {
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.EnemySormIdle))
        const idleSprite = new Sprite({ texture })
        const walkingSheet = new Spritesheet({ sheetUrl: SpritesheetUrls.SormWalking })
        const dyingSheet = new Spritesheet({ sheetUrl: SpritesheetUrls.SormDying })
        const attackingSheet = new Spritesheet({ sheetUrl: SpritesheetUrls.SormAttacking })
        const width = idleSprite.width / 2
        const height = idleSprite.height - 4

        super({
            name: 'Sorm',
            type: CreatureType.Sorm,
            sprites: {
                idleSpriteDef: { sprite: idleSprite },
                dyingSpriteDef: {
                    sprite: dyingSheet,
                    animationOptions: {
                        animationSpeed: 0.175
                    }
                },
                walkingSpriteDef: {
                    sprite: walkingSheet,
                    animationOptions: {
                        animationSpeed: 0.25,
                        loop: true
                    }
                },
                // attackingSpriteDef: {
                //     sprite: attackingSheet,
                //     animationOptions: {
                //         animationSpeed: 0.175
                //     }
                // }
            },
            walkSpeed: 1,
            weight: 0.5,
            boundingDimensions: { width, height },
            boundingBoxAnchor: { x: 0.5, y: 0 }
        })

        InputProcessor.on(InputEvents.KeyDown, (ev: KeyboardEvent) => {
            if (ev.which === Key.I) this.showDyingSprite()
        })
    }

    update() {
        super.update()
    }

    async attack() {
        const lungeVelocity = 3
        const lungeJumpAmount = 2

        this.xVel = this.direction === Direction.Left ? -lungeVelocity : lungeVelocity
        this.jump(lungeJumpAmount)

        return super.attack()
    }

    takeDamage(damageAmount: number) {
        super.takeDamage(damageAmount)
    }
}
