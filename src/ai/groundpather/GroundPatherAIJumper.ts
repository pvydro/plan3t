import { IUpdatable } from '../../interface/IUpdatable'
import { IGroundPatherAI } from './GroundPatherAI'

export interface IGroundPatherAIJumper extends IUpdatable {

}

export interface GroundPatherAIJumperOptions {
    groundPather: IGroundPatherAI
}

export class GroundPatherAIJumper implements IGroundPatherAIJumper {
    groundPather: IGroundPatherAI

    constructor(options: GroundPatherAIJumperOptions) {
        this.groundPather = this.groundPather
    }

    update() {

    }
}
