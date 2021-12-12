import { Container } from 'pixi.js'
import { Graphix } from '../../engine/display/Graphix'
import { AttachmentNodeType } from './AttachmentNodes'

export interface AttachmentNodeConfig {
    type: AttachmentNodeType
    x: number
    y: number
}

export class AttachmentNode extends Container {
    type: AttachmentNodeType
    graphic: Graphix

    constructor(options: AttachmentNodeConfig) {
        super()

        this.type = options.type
        this.graphic = this.createNodeGraphic()
        this.addChild(this.graphic)
    }

    createNodeGraphic(): Graphix {
        const graphic = new Graphix()
        const nodeSize = 2

        graphic.beginFill(0xffffff)
        graphic.drawRect(0, 0, nodeSize, nodeSize)
        graphic.endFill()

        return graphic
    }

    destroy() {
        this.graphic.destroy()
        super.destroy()
    }
}
