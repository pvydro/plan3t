import { ClientPlayer, IClientPlayer } from './ClientPlayer'
import { TrackerPatherAI } from '../../ai/trackerpather/TrackerPatherAI'

export interface IAIPlayer extends IClientPlayer {

}

export class AIPlayer extends ClientPlayer implements IAIPlayer {
    ai: TrackerPatherAI

    constructor() {
        super({
            clientControl: false
        })
        this.ai = new TrackerPatherAI({ gravityOrganism: this })
    }

    update() {
        // super.update()

        this.ai.update()
        this.body.update()
        this.head.update()
        this.overheadHealthBar.update()

        // this.ai
    }
}
