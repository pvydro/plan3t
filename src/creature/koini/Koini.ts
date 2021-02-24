import { Assets, AssetUrls } from '../../asset/Assets'
import { Sprite } from '../../engine/display/Sprite'
import { CreatureType } from '../Creature'
import { ITravelkinCreature, TravelkinCreature } from '../travelkin/TravelkinCreature'

export interface IKoini extends ITravelkinCreature {

}

export class Koini extends TravelkinCreature implements IKoini {
    constructor() {
        const idleTexture = PIXI.Texture.from(Assets.get(AssetUrls.PASSIVE_CREATURE_KOINI))
        super({
            type: CreatureType.Koini,
            walkSpeed: 4,
            weight: 0.5,
            idleSprite: new Sprite({ texture: idleTexture })
        })
    }
}
