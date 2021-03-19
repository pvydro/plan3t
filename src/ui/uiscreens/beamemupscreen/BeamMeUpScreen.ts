import { UIScreen } from '../UIScreen'
import { BeamMeUpHeader } from './BeamMeUpHeader'

export interface IBeamMeUpScreen {

}

export class BeamMeUpScreen extends UIScreen implements IBeamMeUpScreen {
    header: BeamMeUpHeader

    constructor() {
        super()

        this.header = new BeamMeUpHeader()

        this.addChild(this.header)
    }

    forceHide() {
        
    }
}
