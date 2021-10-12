import { IClientEntity } from '../../cliententity/ClientEntity'
import { ClientPlayer, IClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { Creature } from '../../creature/Creature'
import { Direction } from '../../engine/math/Direction'
import { importantLog } from '../../service/Flogger'
import { asyncTimeout, functionExists } from '../../utils/Utils'
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
            const attackDiameter = this.organismAsCreature.attacker.attackDiameter
            const direction = this.organismAsCreature.direction
            const targetNodeOffset = direction === Direction.Left ? attackDiameter : -attackDiameter

            if (this._currentGroundRect !== this.target.currentGroundRect) {
                this.currentGroundRect = this.target.currentGroundRect
            }

            if (this.currentNode && this.currentNode.x !== this.currentTarget.x) {
                this.currentNode.x = this.currentTarget.x + targetNodeOffset
                this.currentState = GroundPatherState.Following
            }
        }
    }

    async attack() {
        importantLog('TrackerPatherAI', 'attack')

        if (functionExists(this.organismAsCreature.attack)) {
            await this.organismAsCreature.attack()
        }
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

    get organismAsCreature() {
        return (this._gravityOrganism as Creature)
    }
}
