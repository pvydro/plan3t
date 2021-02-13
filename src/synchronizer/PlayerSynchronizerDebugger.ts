import { Camera } from '../camera/Camera'
import { CameraLayer } from '../camera/CameraStage'
import { Container } from '../engine/display/Container'
import { Graphix } from '../engine/display/Graphix'
import { IUpdatable } from '../interface/IUpdatable'
import { Flogger } from '../service/Flogger'
import { ShowPlayerSynchDebug } from '../utils/Constants'
import { IPlayerSynchronizerAssertionService } from './PlayerSynchronizerAssertionService'

export interface IPlayerSynchronizerDebugger extends IUpdatable {

}

export interface PlayerSynchronizerDebuggerOptions {
    synchronizer: IPlayerSynchronizerAssertionService
}

export class PlayerSynchronizerDebugger extends Container implements IPlayerSynchronizerDebugger {
    synchronizer: IPlayerSynchronizerAssertionService
    debugGraphics: Graphix
    color: number = 0x60b5b2

    constructor(options: PlayerSynchronizerDebuggerOptions) {
        super()

        this.synchronizer = options.synchronizer

        if (ShowPlayerSynchDebug) {
            this.createDebugGraphics()
        }
    }

    update() {
        if (this.debugGraphics !== undefined
        && this.synchronizer.clientPlayer !== undefined) {

        }
    }

    createDebugGraphics() {
        Flogger.log('CameraDebuggerPlugin', 'createDebugGraphics')

        this.debugGraphics = new Graphix()

        this.debugGraphics.beginFill(this.color)
        this.debugGraphics.drawRect(0, 0, 42, 42)
        this.debugGraphics.endFill()

        this.addChild(this.debugGraphics)

        Camera.getInstance().stage.addChildAtLayer(this, CameraLayer.DebugOverlay)
    }
}
