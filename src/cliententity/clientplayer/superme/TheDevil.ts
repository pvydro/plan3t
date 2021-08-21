import { ISuperMe, SuperMe, SuperMeOptions } from './SuperMe'

export interface ITheDevil extends ISuperMe {

}

export class TheDevil extends SuperMe implements ITheDevil {
    constructor(options: SuperMeOptions) {
        super(options)
    }

    
}
