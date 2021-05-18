import { Assets, AssetUrls } from '../../asset/Assets'
import { SpritesheetUrls } from '../../asset/Spritesheets'
import { CreatureType } from '../../creature/CreatureType'
import { Sprite } from '../../engine/display/Sprite'
import { Spritesheet } from '../../engine/display/spritesheet/Spritesheet'
import { Rect } from '../../engine/math/Rect'
import { Enemy, IEnemy } from '../Enemy'

export interface ISormEnemy extends IEnemy {

}

export class SormEnemy extends Enemy implements ISormEnemy {
    name: 'Sorm'
    _boundingBox?: Rect

    constructor() {
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.EnemySormIdle))
        const idleSprite = new Sprite({ texture })
        const walkingSheet = new Spritesheet({ sheetUrl: SpritesheetUrls.SormWalking })
        const dyingSheet = new Spritesheet({ sheetUrl: SpritesheetUrls.SormDying })
        const width = idleSprite.width / 2
        const height = idleSprite.height - 4

        super({
            type: CreatureType.Sorm,
            sprites: {
                idleSpriteDef: { sprite: idleSprite },
                dyingSpriteDef: { sprite: dyingSheet },
                walkingSpriteDef: {
                    sprite: walkingSheet,
                    animationOptions: {
                        animationSpeed: 0.25,
                        loop: true
                    }
                },
            },
            walkSpeed: 1, weight: 0.5,
            boundingDimensions: { width, height },
            boundingBoxAnchor: { x: 0.5, y: 0 }
        })
    }

    takeDamage(damageAmount: number) {
        super.takeDamage(damageAmount)
    }
}
