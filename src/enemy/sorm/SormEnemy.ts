import { Assets, AssetUrls } from '../../asset/Assets'
import { CreatureType } from '../../creature/Creature'
import { Sprite } from '../../engine/display/Sprite'
import { Enemy, IEnemy } from '../Enemy'

export interface ISormEnemy extends IEnemy {

}

export class SormEnemy extends Enemy implements ISormEnemy {
    constructor() {
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.EnemySormIdle))

        super({
            type: CreatureType.Sorm,
            idleSprite: new Sprite({ texture })
        })
    }
}
