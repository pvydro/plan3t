import * as PIXI from 'pixi.js'
import { Camera } from '../../camera/Camera'
import { CameraLayer } from '../../camera/CameraStage'
import { Container } from '../../engine/display/Container'
import { Graphix } from '../../engine/display/Graphix'
import { Direction } from '../../engine/math/Direction'
import { IUpdatable } from '../../interface/IUpdatable'
import { Flogger } from '../../service/Flogger'
import { exists } from '../../utils/Utils'
import { IGroundPatherAI } from './GroundPatherAI'

export interface IGroundPatherDebugger extends IUpdatable {

}

export interface GroundPatherDebuggerOptions {
    groundPather: IGroundPatherAI
}

export class GroundPatherDebugger implements IGroundPatherDebugger {
    debugValues: any = {
        targetDotSize: 4,
        targetDotDistance: -24,
        groundIndicatorHeight: 2,
        groundIndicatorDistance: 6,
        groundIndicatorBleedAmount: 8
    }
    currentTargetGraphics: Graphix
    currentGroundGraphics: Graphix
    currentRangeGraphics: Graphix
    currentNodeGraphics: Graphix

    groundPather: IGroundPatherAI
    aiColor: number = Math.floor(Math.random() * 16777215)
    debugContainer: Container

    constructor(options: GroundPatherDebuggerOptions) {
        this.groundPather = options.groundPather

        this.createDebugGraphics()
    }

    update() {
        const currentGroundRect = this.gravityEntity.currentGroundRect
        const currentDistanceFromEdge = this.groundPather.currentDistanceFromEdge
        const currentNode = this.groundPather.currentNode
        const groundIndicatorDistance = this.debugValues.groundIndicatorDistance
        const groundIndicatorBleedAmount = this.debugValues.groundIndicatorBleedAmount
        const targetDotDistance = this.debugValues.targetDotDistance
        const targetDotSize = this.debugValues.targetDotSize
        const targetDirection = this.gravityEntity.direction

        // Target dot
        this.currentTargetGraphics.x = this.gravityEntity.x + (targetDotSize / 2)
        this.currentTargetGraphics.y = this.gravityEntity.y + targetDotDistance

        if (this.gravityEntity.isOnGround && exists(currentGroundRect)) {
            // Ground indicator
            this.currentGroundGraphics.x = currentGroundRect.x - (groundIndicatorBleedAmount / 2)
            this.currentGroundGraphics.y = currentGroundRect.y + groundIndicatorDistance
            this.currentGroundGraphics.width = currentGroundRect.width + groundIndicatorBleedAmount

            // Range indicator
            this.currentRangeGraphics.x = this.gravityEntity.x
            this.currentRangeGraphics.y = currentGroundRect.y + (groundIndicatorDistance * 2)
            this.currentRangeGraphics.width = currentDistanceFromEdge
            if (targetDirection === Direction.Left) {
                this.currentRangeGraphics.x -= this.currentRangeGraphics.width
            }

            // Node inidicator
            if (exists(currentNode)) {
                this.currentNodeGraphics.x = currentNode.x
                this.currentNodeGraphics.y = currentNode.y
            }
        }
    }

    createDebugGraphics() {
        Flogger.log('GroundPatherDebugger', 'createDebugGraphics')
        const camera = Camera.getInstance()
        const targetDotSize = this.debugValues.targetDotSize

        this.debugContainer = new Container()
        this.currentTargetGraphics = new Graphix({ alpha: 0.5 })
        this.currentGroundGraphics = new Graphix({ alpha: 0.25 })
        this.currentRangeGraphics = new Graphix()
        this.currentNodeGraphics = new Graphix()

        const graphix = [
            this.currentTargetGraphics, this.currentGroundGraphics,
            this.currentRangeGraphics, this.currentNodeGraphics
        ]

        for (var i in graphix) {
            const g = graphix[i]
            const isCurrentNode = (g === this.currentNodeGraphics)

            g.beginFill(isCurrentNode ? 0xFFFFFF : this.aiColor)
            g.drawRect(0, 0, targetDotSize, targetDotSize)
            g.blendMode = PIXI.BLEND_MODES.COLOR_BURN

            this.debugContainer.addChild(g)
        }

        this.currentTargetGraphics.rotation = 45 * (Math.PI / 180)
        this.currentGroundGraphics.height = this.debugValues.groundIndicatorHeight
        this.currentRangeGraphics.height = this.debugValues.groundIndicatorHeight

        camera.stage.addChildAtLayer(this.debugContainer, CameraLayer.DebugOverlay)
    }

    get gravityEntity() {
        return this.groundPather.gravityEntity
    }
}
