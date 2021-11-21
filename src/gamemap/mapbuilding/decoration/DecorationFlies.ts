import { PassiveFly } from '../../../creature/passivefly/PassiveFly'
import { Container, IContainer } from '../../../engine/display/Container'

export interface IDecorationFlies extends IContainer {

}

export class DecorationFlies extends Container implements IDecorationFlies {
    flies: PassiveFly[] = []

    constructor() {
        super()
    }

    createFlies() {
        
    }

    addFly() {
        const fly = new PassiveFly()
        this.flies.push(fly)
        this.addChild(fly)
    }
}
