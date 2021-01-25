import { Container } from '../engine/display/Container'
import { IPassiveCreature, PassiveCreature } from '../passivecreature/PassiveCreature'

export interface IPet extends IPassiveCreature {

}

export abstract class Pet extends PassiveCreature implements IPet {
    constructor() {
        super()
    }
}
