import { EntityStatePack } from '../../../interface/IStatePack'

export interface PlayerStatePack extends EntityStatePack {
    direction: number
    bodyState: number
    legsState: number
}
