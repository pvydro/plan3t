import { Camera } from '../camera/Camera'
import { CameraLayer } from '../camera/CameraStage'
import { Container } from '../engine/display/Container'
import { Graphix } from '../engine/display/Graphix'
import { IUpdatable } from '../interface/IUpdatable'
import { RoomManager } from '../manager/roommanager/RoomManager'
import { Player } from '../network/rooms/Player'
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
    rotationDebugGraphics: Graphix
    color: number = 0x60b5b2
    rotationColor: number = 0xfcba03

    constructor(options: PlayerSynchronizerAssertionServiceDebuggerOptions) {
        super()

        this.assertionService = options.assertionService

        if (ShowPlayerSynchDebug) {
            this.createDebugGraphics()
        }
    }

    update() {
        const synchPlayerInstance = this.assertionService.entityAssertionService
            .synchronizables.get(this.localSessionId) as Player
        if (this.debugGraphics !== undefined
        && this.assertionService.clientPlayer !== undefined
        && synchPlayerInstance !== undefined) {

            this.debugGraphics.x = synchPlayerInstance.x - (this.debugGraphics.width / 2)
            this.debugGraphics.y = synchPlayerInstance.y - (this.debugGraphics.height / 2)

            this.rotationDebugGraphics.x = synchPlayerInstance.x - (this.rotationDebugGraphics.width / 2)
            this.rotationDebugGraphics.y = synchPlayerInstance.y - (this.rotationDebugGraphics.height / 2)

            this.rotationDebugGraphics.rotation = synchPlayerInstance.weaponStatus.rotation
        }
    }

    createDebugGraphics() {
        Flogger.log('CameraDebuggerPlugin', 'createDebugGraphics')

        this.debugGraphics = new Graphix()
        this.rotationDebugGraphics = new Graphix()

        this.debugGraphics.beginFill(this.color)
        this.rotationDebugGraphics.beginFill(this.color)
        this.debugGraphics.drawRect(0, 0, 4, 42)
        this.debugGraphics.endFill()

        this.rotationDebugGraphics.beginFill(this.rotationColor)
        this.rotationDebugGraphics.drawRect(0, 0, 32, 2)
        this.rotationDebugGraphics.endFill()

        this.addChild(this.debugGraphics)
        this.addChild(this.rotationDebugGraphics)

        Camera.getInstance().stage.addChildAtLayer(this, CameraLayer.DebugOverlay)
    }

    get localSessionId() {
        return RoomManager.clientSessionId
    }
}
