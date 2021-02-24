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
        targetDotDistance: 24
    }
    groundPather: IGroundPatherAI
    aiColor: number = 0xe67eed
    debugContainer: Container
    currentTargetGraphics: Graphix
    currentGroundGraphics: Graphix

    constructor(options: GroundPatherDebuggerOptions) {
        this.groundPather = options.groundPather

        this.createDebugGraphics()
    }

    update() {
        // Target dot
        this.currentTargetGraphics.x = this.clientEntity.x + (this.debugValues.targetDotSize / 2)
        this.currentTargetGraphics.y = this.clientEntity.y - this.debugValues.targetDotDistance
    }

    createDebugGraphics() {
        Flogger.log('GroundPatherDebugger', 'createDebugGraphics')
        const camera = Camera.getInstance()
        const targetDotSize = this.debugValues.targetDotSize

        this.debugContainer = new Container()
        this.currentTargetGraphics = new Graphix()
        this.currentGroundGraphics = new Graphix()

        this.currentTargetGraphics.beginFill(this.aiColor)
        this.currentTargetGraphics.drawRect(0, 0, targetDotSize, targetDotSize)

        this.debugContainer.addChild(this.currentTargetGraphics, this.currentGroundGraphics)

        camera.stage.addChildAtLayer(this.debugContainer, CameraLayer.DebugOverlay)
    }

    get clientEntity() {
        return this.groundPather.clientEntity
    }
}
