import * as PIXI from 'pixi.js'
import { IEnemy, Enemy } from '../Enemy'
import { Assets, AssetUrls } from '../../asset/Assets'
import { Entity } from '../../network/rooms/Entity'
import { Sprite } from '../../engine/display/Sprite'
import { Dimension } from '../../engine/math/Dimension'
import { CreatureType } from '../../creature/Creature'

export interface IFlyingEnemy extends IEnemy {

}

export class FlyingEnemy extends Enemy implements IFlyingEnemy {
    constructor(entity?: Entity) {
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.EnemyFlyingEyeIdle))
        
        super({
            type: CreatureType.FlyingEye,
            idleSprite: new Sprite({ texture })
        })

        this.dimension = new Dimension(48, 48)
    }
}
