import { Container } from 'pixi.js'
import { Camera } from '../../camera/Camera'
import { CameraLayer } from '../../camera/CameraStage'
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
        targetDotSize: 6,
        targetDotDistance: -24,
        groundIndicatorHeight: 2,
        groundIndicatorDistance: 6
    }
    groundPather: IGroundPatherAI
    aiColor: number = Math.floor(Math.random() * 16777215)
    debugContainer: Container
    currentTargetGraphics: Graphix
    currentGroundGraphics: Graphix

    constructor(options: GroundPatherDebuggerOptions) {
        this.groundPather = options.groundPather

        this.createDebugGraphics()
    }

    update() {
        const currentGroundRect = this.gravityEntity.currentGroundRect
        const groundIndicatorDistance = this.debugValues.groundIndicatorDistance
        const targetDotDistance = this.debugValues.targetDotDistance
        const targetDotSize = this.debugValues.targetDotSize

        // Target dot
        this.currentTargetGraphics.x = this.gravityEntity.x + (targetDotSize / 2)
        this.currentTargetGraphics.y = this.gravityEntity.y + targetDotDistance

        if (this.gravityEntity.isOnGround && currentGroundRect !== undefined) {
            this.currentGroundGraphics.x = currentGroundRect.x
            this.currentGroundGraphics.y = currentGroundRect.y + groundIndicatorDistance
            this.currentGroundGraphics.width = currentGroundRect.width + 32
        }
    }

    createDebugGraphics() {
        Flogger.log('GroundPatherDebugger', 'createDebugGraphics')
        const camera = Camera.getInstance()
        const targetDotSize = this.debugValues.targetDotSize
        const groundIndicatorHeight = this.debugValues.groundIndicatorHeight

        this.debugContainer = new Container()
        this.currentTargetGraphics = new Graphix()
        this.currentGroundGraphics = new Graphix()

        this.currentTargetGraphics.beginFill(this.aiColor)
        this.currentTargetGraphics.drawRect(0, 0, targetDotSize, targetDotSize)
        this.currentGroundGraphics.beginFill(this.aiColor)
        this.currentGroundGraphics.drawRect(0, 0, targetDotSize, groundIndicatorHeight)

        this.debugContainer.addChild(this.currentTargetGraphics, this.currentGroundGraphics)
        this.debugContainer.alpha = 0.5

        camera.stage.addChildAtLayer(this.debugContainer, CameraLayer.DebugOverlay)
    }

    get gravityEntity() {
        return this.groundPather.gravityEntity
    }
}
