import { IUpdatable } from '../interface/IUpdatable'
import { asyncTimeout } from '../utils/Utils'
import { CreatureAttackOptions } from './Creature'

export interface ICreatureAttacker extends IUpdatable {
    attackTime: number
    attackRadius: number
    attackDiameter: number
    damage: number
    attack(): Promise<void>
}

export class CreatureAttacker implements ICreatureAttacker {
    attackTime: number
    attackRadius: number
    damage: number

    constructor(options: CreatureAttackOptions) {
        this.attackTime = options.attackTime ?? 1000
        this.attackRadius = options.attackRadius ?? 20
        this.damage = options.damage ?? 10
    }

    update() {
        
    }

    async attack() {
        await asyncTimeout(1000)
    }

    get attackDiameter() {
        return this.attackRadius / 2
    }
}
