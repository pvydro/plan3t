import { IRect, Rect } from '../../engine/math/Rect'
import { IUpdatable } from '../../interface/IUpdatable'
import { IGroundPatherAI } from './GroundPatherAI'

export interface IGroundPatherAIJumper extends IUpdatable {
    sensor: IRect
}

export interface GroundPatherAIJumperOptions {
    groundPather: IGroundPatherAI
}

export class GroundPatherAIJumper implements IGroundPatherAIJumper {
    groundPather: IGroundPatherAI
    sensorRect: Rect
    sensorPadding: number = 16

    constructor(options: GroundPatherAIJumperOptions) {
        this.groundPather = options.groundPather
        
        const x = 0 + this.groundPather.target.halfWidth - (this.sensorPadding / 2)
        const width = (this.groundPather.target.width + (this.sensorPadding * 2))
        const height = this.groundPather.target.height

        this.sensorRect = new Rect({
            x, y: 0,
            width, height
        })
    }

    update() {

    }

    get sensor() {
        return this.sensorRect
    }
}
