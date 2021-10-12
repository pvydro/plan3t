import { Assets, AssetUrls } from '../../asset/Assets'
import { CreatureType } from '../../creature/CreatureType'
import { Sprite } from '../../engine/display/Sprite'
import { Weapon } from '../../weapon/Weapon'
import { WeaponName } from '../../weapon/WeaponName'
import { Enemy, IEnemy } from '../Enemy'

export interface ITorkEnemy extends IEnemy {

}

export class TorkEnemy extends Enemy implements ITorkEnemy {
    weapon: Weapon

    constructor() {
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.EnemyTorkIdle))
        const idleSprite = new Sprite({ texture })
        const width = idleSprite.width / 2
        const height = idleSprite.height - 4

        super({
            name: 'Tork',
            type: CreatureType.Tork,
            sprites: { idleSpriteDef: { sprite: idleSprite} },
            walkSpeed: 1,
            weight: 0.5,
            boundingDimensions: { width, height },
            boundingBoxAnchor: { x: 0.5, y: 0 }
        })

        this.weapon = new Weapon({
            name: WeaponName.Kortni
        })
        this.weapon.position.set(
            this.halfWidth - this.weapon.halfWidth,
            this.halfHeight + this.weapon.halfHeight)

        this.addChild(this.weapon)
    }
}
