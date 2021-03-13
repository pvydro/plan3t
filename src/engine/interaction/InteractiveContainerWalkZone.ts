import { Container, IContainer } from '../display/Container'
import { Graphix } from '../display/Graphix'
import { IRect } from '../math/Rect'
import { InteractiveContainerCallbacks } from './InteractiveContainer'

export interface IInteractiveContainerWalkZone extends IContainer, InteractiveContainerCallbacks {

}

export interface InteractiveContainerWalkZoneOptions {
    interactiveBounds: IRect
    interactiveOffsetX?: number
}

export class InteractiveContainerWalkZone extends Container implements IInteractiveContainerWalkZone {
    interactiveBounds: IRect
    interactiveOffsetX: number = 0
    nodeDistance: number = 5

    nodeOne: Graphix = this.constructNode()
    nodeTwo: Graphix = this.constructNode()
    nodes: Graphix[] = [ this.nodeOne, this.nodeTwo ]

    constructor(options: InteractiveContainerWalkZoneOptions) {
        super()

        this.interactiveBounds = options.interactiveBounds
        this.interactiveOffsetX = options.interactiveOffsetX

        for (const i in this.nodes) {
            const node = this.nodes[i]
            node.height = (this.interactiveBounds.height * 0.75)
            node.y += (this.interactiveBounds.height * 0.125)
            this.addChild(node)
        }

        this.styleNodes()
    }

    onEnter() {
        this.alpha = 1
    }

    onExit() {
        this.alpha = 0
    }

    styleNodes() {
        this.nodeOne.x = this.interactiveOffsetX - (this.interactiveBounds.width / 2)// - this.nodeDistance
        this.nodeTwo.x = this.interactiveOffsetX + (this.interactiveBounds.width / 2)
    }

    constructNode(): Graphix {
        const graphics = new Graphix()

        graphics.beginFill(0xffffff)
        graphics.drawRect(0, 0, 1, 1)
        graphics.endFill()
        graphics.pivot.set(0, 0)

        return graphics
    }
}

