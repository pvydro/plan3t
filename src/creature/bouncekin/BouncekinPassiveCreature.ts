import { TravelkinCreature, TravelkinCreatureOptions } from '../travelkin/TravelKinCreature'

export interface IBounceKinPassiveCreature {
    
}

export interface BounceKinPassiveCreatureOptions extends TravelkinCreatureOptions {

}

export abstract class BounceKinPassiveCreature extends TravelkinCreature implements IBounceKinPassiveCreature {
    constructor(options: BounceKinPassiveCreatureOptions) {
        super(options)
    }
}
