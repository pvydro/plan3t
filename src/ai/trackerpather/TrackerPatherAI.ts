import { ClientPlayer, IClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { AIOptions, IAI } from '../AI'
import { GroundPatherAI, GroundPatherState } from '../groundpather/GroundPatherAI'

export interface ITrackerPatherAI extends IAI {

}

export interface TrackerPatherOptions extends AIOptions {

}

export class TrackerPatherAI extends GroundPatherAI implements ITrackerPatherAI {
    followTarget: IClientPlayer

    constructor(options: TrackerPatherOptions) {
        super(options)
    }

    update() {
        // this.debugger.update()
        this.jumper.update()

        if (!this.isDead) {
            if (this._currentGroundRect !== this.target.currentGroundRect) {
                this.currentGroundRect = this.target.currentGroundRect

                // this.startTrackingPlayer()
            }

            // if (this.currentState === GroundPatherState.Following)

            // if (this.currentState === GroundPatherState.Idle && this.currentNode === undefined
            // && this.currentGroundRect !== undefined) {

            // }
        }
    }

    findPointOnCurrentGround() {
        const clientPlayer = ClientPlayer.getInstance()

        this.currentNode = {
            x: clientPlayer.x,
            y: this.currentGroundRect.y
        }
    }

    startTrackingPlayer() {
        this.currentState = GroundPatherState.Following

        this.findNewPoint()
        // this.decideIfContinueOrStop()
    }

    findNewPoint() {
        if (this.isDead) return

        this.findPointOnCurrentGround()
    }

    // findPlayerPoint() {

    // }
}
