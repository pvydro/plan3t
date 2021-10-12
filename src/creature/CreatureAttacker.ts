import { IUpdatable } from '../interface/IUpdatable'
import { CreatureAttackOptions } from './Creature'

export interface ICreatureAttacker extends IUpdatable {
    attackRadius: number
}

export class CreatureAttacker implements ICreatureAttacker {
    attackTime: number
    attackRadius: number
    damage: number

    constructor(options: CreatureAttackOptions) {
        this.attackTime = options.attackTime
        this.attackRadius = options.attackRadius
        this.damage = options.damage
    }

    update() {
        
    }
}
