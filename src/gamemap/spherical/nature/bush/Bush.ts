import { INature, Nature, NatureOptions } from './Nature'

export enum BushType {
    TicBerry
}

export interface IBush extends INature {

}

export interface BushOptions extends NatureOptions {
    type: BushType
}

export class Bush extends Nature implements IBush {
    constructor(options: BushOptions) {
        super(options)
    }
}
