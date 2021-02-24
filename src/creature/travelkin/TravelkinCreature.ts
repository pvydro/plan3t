import { GroundPatherAI, IGroundPatherAI } from '../../ai/groundpather/GroundPatherAI'
import { ICreature, Creature, CreatureOptions } from '../Creature'

export interface ITravelkinCreature extends ICreature {
    ai: IGroundPatherAI
}

export interface TravelkinCreatureOptions extends CreatureOptions {
    walkSpeed: number
}

export class TravelkinCreature extends Creature implements ITravelkinCreature {
    walkSpeed: number
    ai: IGroundPatherAI

    constructor(options: TravelkinCreatureOptions) {
        super(options)

        this.walkSpeed = options.walkSpeed
        this.ai = new GroundPatherAI({
            gravityEntity: this
        })
    }

    update() {
        this.ai.update()
        
        super.update()
    }
}
