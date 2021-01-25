import { Container } from "../engine/display/Container";

export interface IPassiveCreature {

}

export class PassiveCreature extends Container implements IPassiveCreature {
    constructor() {
        super()
    }
}
