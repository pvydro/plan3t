import { Assets, AssetUrls } from '../../asset/Assets'
import { Sprite } from '../../engine/display/Sprite'
import { Direction } from '../../engine/math/Direction'
import { CreatureType } from '../CreatureType'
import { ITravelkinCreature, TravelkinCreature } from '../travelkin/TravelkinCreature'

export interface IKoini extends ITravelkinCreature {

}

export class Koini extends TravelkinCreature implements IKoini {
    constructor() {
        const idleTexture = PIXI.Texture.from(Assets.get(AssetUrls.PassiveCreatureKoini))

        super({
            type: CreatureType.Koini,
            walkSpeed: 1,
            weight: 0.5,
            sprites: {
                idleSpriteDef: {
                    sprite: new Sprite({ texture: idleTexture })
                }
            }
        })
        
        this._direction = Math.random() > 0.5 ? Direction.Right : Direction.Left
    }
}
