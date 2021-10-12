import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../asset/Assets'
import { CreatureType } from '../../creature/CreatureType'
import { Sprite } from '../../engine/display/Sprite'
import { Enemy } from '../Enemy'

export interface INenjEnemy {

}

export class NenjEnemy extends Enemy implements INenjEnemy {
    constructor() {
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.EnemyNenjIdle))
        const idleSprite = new Sprite({ texture })
        const width = idleSprite.width / 2
        const height = idleSprite.height

        super({
            name: 'Nenj',
            type: CreatureType.Nenj,
            sprites: {
                idleSpriteDef: { sprite: idleSprite }
            },
            walkSpeed: 1, weight: 0.5,
            boundingDimensions: { width, height },
            // boundingBoxAnchor: { x: 0.5, y: 1 }
        })
    }
}
