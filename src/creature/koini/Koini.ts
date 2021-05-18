import { Assets, AssetUrls } from '../../asset/Assets'
import { Sprite } from '../../engine/display/Sprite'
import { Direction } from '../../engine/math/Direction'
import { CreatureType } from '../Creature'
import { ITravelkinCreature, TravelkinCreature } from '../travelkin/TravelkinCreature'

export interface IKoini extends ITravelkinCreature {

}

export class Koini extends TravelkinCreature implements IKoini {
    constructor() {
        const idleTexture = PIXI.Texture.from(Assets.get(AssetUrls.PassiveCreatureKoini))

        super({
            type: CreatureType.Koini,
            idleSprite: new Sprite({ texture: idleTexture }),
            walkSpeed: 1,
            weight: 0.5
        })
        
        this._direction = Math.random() > 0.5 ? Direction.Right : Direction.Left
    }
}
