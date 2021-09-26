import { IClientEntity } from '../../cliententity/ClientEntity'
import { ClientPlayer, IClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { importantLog } from '../../service/Flogger'
import { asyncTimeout } from '../../utils/Utils'
import { IAI } from '../AI'
import { GroundPatherAI, GroundPatherOptions, GroundPatherState } from '../groundpather/GroundPatherAI'

export interface ITrackerPatherAI extends IAI {

}

export interface TrackerPatherOptions extends GroundPatherOptions {

}

export class TrackerPatherAI extends GroundPatherAI implements ITrackerPatherAI {
    followTarget: IClientPlayer
    currentTarget: IClientEntity

    constructor(options: TrackerPatherOptions) {
        options.idleTimeRange = options.idleTimeRange ?? 100
        super(options)
    }

    update() {
        this.debugger.update()
        this.jumper.update()

        if (!this.isDead) {
            if (this._currentGroundRect !== this.target.currentGroundRect) {
                this.currentGroundRect = this.target.currentGroundRect

                // this.startTrackingPlayer()
            }

            if (this.currentNode && this.currentNode.x !== this.currentTarget.x) {
                this.currentNode.x = this.currentTarget.x
                this._currentState = GroundPatherState.Following
            }


            // if (this.currentState === GroundPatherState.Following)

            // if (this.currentState === GroundPatherState.Idle && this.currentNode === undefined
            // && this.currentGroundRect !== undefined) {

            // }
        }
    }

    async attack() {
        importantLog('TrackerPatherAI', 'attack')

        await asyncTimeout(1000)
    }

    findPointOnCurrentGround() {
        const clientPlayer = ClientPlayer.getInstance()

        this.currentNode = {
            x: clientPlayer.x,
            y: this.currentGroundRect.y
        }

        this.currentTarget = clientPlayer
    }

    hasReachedNode() {
        this.currentState = GroundPatherState.Idle
        this.clearCurrentNode()

        this.attack().then(() => {
            this.startTrackingPlayer()
        })
    }

    startTrackingPlayer() {
        this.currentState = GroundPatherState.Following

        this.findNewPoint()
    }

    findNewPoint() {
        if (this.isDead) return

        this.findPointOnCurrentGround()
    }
}
