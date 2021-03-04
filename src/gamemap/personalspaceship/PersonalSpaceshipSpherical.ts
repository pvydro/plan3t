import { ISpherical, Spherical } from '../spherical/Spherical'
import { SphericalData } from '../spherical/SphericalData';

export interface IPersonalSpaceshipSpherical extends ISpherical {

}

export class PersonalSpaceshipSpherical extends Spherical implements IPersonalSpaceshipSpherical {
    constructor(data: SphericalData) {
        super(data)
    }
}
