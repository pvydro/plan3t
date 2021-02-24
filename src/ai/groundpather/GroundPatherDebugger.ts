import * as PIXI from 'pixi.js'
import { Camera } from '../../camera/Camera'
import { CameraLayer } from '../../camera/CameraStage'
import { Container } from '../../engine/display/Container'
import { Graphix } from '../../engine/display/Graphix'
import { IUpdatable } from '../../interface/IUpdatable'
import { Flogger } from '../../service/Flogger'
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
    groundPather: IGroundPatherAI
    aiColor: number = Math.floor(Math.random() * 16777215)
    debugContainer: Container
    currentTargetGraphics: Graphix
    currentGroundGraphics: Graphix
    currentRangeGraphics: Graphix

    constructor(options: GroundPatherDebuggerOptions) {
        this.groundPather = options.groundPather

        this.createDebugGraphics()
    }

    update() {
        const currentGroundRect = this.gravityEntity.currentGroundRect
        const groundIndicatorDistance = this.debugValues.groundIndicatorDistance
        const groundIndicatorBleedAmount = this.debugValues.groundIndicatorBleedAmount
        const groundIndicatorHeight = this.debugValues.groundIndicatorHeight
        const targetDotDistance = this.debugValues.targetDotDistance
        const targetDotSize = this.debugValues.targetDotSize

        // Target dot
        this.currentTargetGraphics.x = this.gravityEntity.x + (targetDotSize / 2)
        this.currentTargetGraphics.y = this.gravityEntity.y + targetDotDistance

        if (this.gravityEntity.isOnGround && currentGroundRect !== undefined) {
            this.currentGroundGraphics.x = currentGroundRect.x - (groundIndicatorBleedAmount / 2)
            this.currentGroundGraphics.y = currentGroundRect.y + groundIndicatorDistance
            this.currentGroundGraphics.width = currentGroundRect.width + groundIndicatorBleedAmount
            this.currentGroundGraphics.height = groundIndicatorHeight
        }
    }

    createDebugGraphics() {
        Flogger.log('GroundPatherDebugger', 'createDebugGraphics')
        const camera = Camera.getInstance()
        const targetDotSize = this.debugValues.targetDotSize

        this.debugContainer = new Container()
        this.currentTargetGraphics = new Graphix()
        this.currentGroundGraphics = new Graphix()
        this.currentRangeGraphics = new Graphix()

        const graphix = [
            this.currentTargetGraphics, this.currentGroundGraphics, this.currentRangeGraphics
        ]

        for (var i in graphix) {
            const g = graphix[i]

            g.beginFill(this.aiColor)
            g.drawRect(0, 0, targetDotSize, targetDotSize)
            g.blendMode = PIXI.BLEND_MODES.COLOR_BURN

            this.debugContainer.addChild(g)
        }

        this.currentTargetGraphics.rotation = 45 * (Math.PI / 180)
        this.debugContainer.alpha = 0.5

        camera.stage.addChildAtLayer(this.debugContainer, CameraLayer.DebugOverlay)
    }

    get gravityEntity() {
        return this.groundPather.gravityEntity
    }
}
