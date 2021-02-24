import { TravelkinPassiveCreature, TravelkinPassiveCreatureOptions } from '../travelkin/TravelKinPassiveCreature'

export interface IBounceKinPassiveCreature {
    
}

export interface BounceKinPassiveCreatureOptions extends TravelkinPassiveCreatureOptions {

}

export abstract class BounceKinPassiveCreature extends TravelkinPassiveCreature implements IBounceKinPassiveCreature {
    constructor(options: BounceKinPassiveCreatureOptions) {
        super(options)
    }
}
