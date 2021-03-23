import { Flogger } from '../../../service/Flogger'
import { UIScreen } from '../UIScreen'
import { BeamMeUpButton } from './BeamMeUpButton'
import { BeamMeUpHeader, IBeamMeUpHeader } from './BeamMeUpHeader'
import { BeamMeUpScreenAnimator, IBeamMeUpScreenAnimator } from './BeamMeUpScreenAnimator'

export interface IBeamMeUpScreen {
    header: IBeamMeUpHeader
}

export class BeamMeUpScreen extends UIScreen implements IBeamMeUpScreen {
    header: BeamMeUpHeader
    beamMeUpButton: BeamMeUpButton
    animator: IBeamMeUpScreenAnimator

    constructor() {
        super()

        this.header = new BeamMeUpHeader()
        this.animator = new BeamMeUpScreenAnimator({ screen: this })
        this.beamMeUpButton = new BeamMeUpButton()

        this.addChild(this.header)
        this.addChild(this.beamMeUpButton)

        this.beamMeUpButton.position.set(100, 100)
    }

    async show() {
        Flogger.log('BeamMeUpScreen', 'show')

        await this.animator.show()
    }

    async hide() {
        Flogger.log('BeamMeUpScreen', 'hide')
        
        await this.animator.hide()
    }

    forceHide() {
        this.header.forceHide()
    }
}
