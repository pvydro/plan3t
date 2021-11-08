import { GravityOrganism } from '../../../cliententity/gravityorganism/GravityOrganism'

export interface IDecorCreature extends GravityOrganism {

}

export class DecorCreature extends GravityOrganism implements IDecorCreature {
    constructor () {
        super()
    }
}
