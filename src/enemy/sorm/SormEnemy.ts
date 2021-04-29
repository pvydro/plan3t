import { Assets, AssetUrls } from '../../asset/Assets'
import { Spritesheets, SpritesheetUrls } from '../../asset/Spritesheets'
import { CreatureType } from '../../creature/Creature'
import { Sprite } from '../../engine/display/Sprite'
import { Rect } from '../../engine/math/Rect'
import { Enemy, IEnemy } from '../Enemy'

export interface ISormEnemy extends IEnemy {

}

export class SormEnemy extends Enemy implements ISormEnemy {
    _boundingBox?: Rect

    constructor() {
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.EnemySormIdle))
        const idleSprite = new Sprite({ texture })
        const walkingSheet = Spritesheets.get(SpritesheetUrls.SormWalking)
        const width = idleSprite.width / 2
        const height = idleSprite.height - 4

        super({
            type: CreatureType.Sorm,
            idleSprite, walkingSheet,
            walkSpeed: 1, weight: 0.5,
            boundingDimensions: { width, height },
            boundingBoxAnchor: { x: 0.5, y: 0 }
        })
    }
}
