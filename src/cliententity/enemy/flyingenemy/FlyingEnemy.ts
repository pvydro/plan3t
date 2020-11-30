import * as PIXI from 'pixi.js'
import { IEnemy, Enemy } from '../Enemy'
import { Assets, AssetUrls } from '../../../asset/Assets'
import { Entity } from '../../../network/rooms/Entity'

export interface IFlyingEnemy extends IEnemy {

}

export class FlyingEnemy extends Enemy implements IFlyingEnemy {
    constructor(entity?: Entity) {
        super({
            sprite: new PIXI.Sprite(PIXI.Texture.from(Assets.get(AssetUrls.ENEMY_FLYINGEYE_IDLE)))
        })
    }
}
