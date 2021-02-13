import { Camera } from '../camera/Camera'
import { CameraLayer } from '../camera/CameraStage'
import { Container } from '../engine/display/Container'
import { Graphix } from '../engine/display/Graphix'
import { IUpdatable } from '../interface/IUpdatable'
import { RoomManager } from '../manager/roommanager/RoomManager'
import { Flogger } from '../service/Flogger'
import { ShowPlayerSynchDebug } from '../utils/Constants'
import { IPlayerSynchronizerAssertionService } from './PlayerSynchronizerAssertionService'

export interface IPlayerSynchronizerAssertionServiceDebugger extends IUpdatable {

}

export interface PlayerSynchronizerAssertionServiceDebuggerOptions {
    assertionService: IPlayerSynchronizerAssertionService
}

export class PlayerSynchronizerAssertionServiceDebugger extends Container implements IPlayerSynchronizerAssertionServiceDebugger {
    assertionService: IPlayerSynchronizerAssertionService
    debugGraphics: Graphix
    color: number = 0x60b5b2

    constructor(options: PlayerSynchronizerAssertionServiceDebuggerOptions) {
        super()

        this.assertionService = options.assertionService

        if (ShowPlayerSynchDebug) {
            this.createDebugGraphics()
        }
    }

    update() {
        if (this.debugGraphics !== undefined
        && this.assertionService.clientPlayer !== undefined) {
            const synchPlayerInstance = this.assertionService.entityAssertionService
                .synchronizables.get(this.localSessionId)

            this.debugGraphics.x = synchPlayerInstance.x - (this.debugGraphics.width / 2)
            this.debugGraphics.y = synchPlayerInstance.y - (this.debugGraphics.height / 2)
        }
    }

    createDebugGraphics() {
        Flogger.log('CameraDebuggerPlugin', 'createDebugGraphics')

        this.debugGraphics = new Graphix()

        this.debugGraphics.beginFill(this.color)
        this.debugGraphics.drawRect(0, 0, 4, 42)
        this.debugGraphics.endFill()

        this.addChild(this.debugGraphics)

        Camera.getInstance().stage.addChildAtLayer(this, CameraLayer.DebugOverlay)
    }

    get localSessionId() {
        return RoomManager.clientSessionId
    }
}
