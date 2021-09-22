import { ITravelkinCreature, TravelkinCreature, TravelkinCreatureOptions } from '../travelkin/TravelkinCreature'

export interface IShooterkinCreature extends ITravelkinCreature {

}

export interface ShooterkinCreatureOptions extends TravelkinCreatureOptions {

}

export class ShooterkinCreature extends TravelkinCreature implements IShooterkinCreature {
    constructor(options: ShooterkinCreatureOptions) {
        super(options)

        // this.ai = new 
    }
}
