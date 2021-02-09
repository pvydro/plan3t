import { EntityStatePack } from '../../../interface/IStatePack'

export interface PlayerStatePack extends EntityStatePack {
    walkingDirection: number
    direction: number
    bodyState: number
    legsState: number
}
