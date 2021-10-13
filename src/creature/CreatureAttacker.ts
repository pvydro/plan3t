import { ClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { Rect } from '../engine/math/Rect'
import { IUpdatable } from '../interface/IUpdatable'
import { asyncTimeout } from '../utils/Utils'
import { ICreature } from './Creature'

export interface ICreatureAttacker extends IUpdatable {
    attackTime: number
    attackRadius: number
    attackDiameter: number
    damage: number
    attack(): Promise<void>
}

export interface CreatureAttackOptions {
    attackTime?: number
    attackRadius?: number
    damage?: number
}

export interface CreatureAttackerOptions extends CreatureAttackOptions {
    creature: ICreature
}

export class CreatureAttacker implements ICreatureAttacker {
    _attacking: boolean
    attackTime: number
    attackRadius: number
    damage: number
    creature: ICreature

    constructor(options: CreatureAttackerOptions) {
        this.attackTime = options.attackTime ?? 1000
        this.attackRadius = options.attackRadius ?? 20
        this.damage = options.damage ?? 10
        this.creature = options.creature
    }

    update() {
        if (this._attacking) {
            const creatureBoundingBox = this.creature.boundsWithPosition
            const target = ClientPlayer.getInstance()
            const targetBoundingBox = target.boundsWithPosition

            if (Rect.intersects(creatureBoundingBox, targetBoundingBox)) {
                this._attacking = false
                target.takeDamage(this.damage)
            }
        }
    }

    async attack() {
        this._attacking = true
        await asyncTimeout(1000)
    }

    get attackDiameter() {
        return this.attackRadius / 2
    }

    get isAttacking() {
        return this._attacking
    }
}
