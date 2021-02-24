import { AI, AIOptions, IAI } from '../AI'

export interface IGroundPather extends IAI {

}

export interface GroundPatherOptions extends AIOptions {

}

export class GroundPather extends AI implements IGroundPather {
    constructor(options: GroundPatherOptions) {
        super(options)
    }
}
