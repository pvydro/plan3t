import * as PIXI from 'pixi.js'
import { Camera } from '../../camera/Camera'
import { CameraLayer } from '../../camera/CameraStage'
import { Container } from '../../engine/display/Container'
import { Graphix } from '../../engine/display/Graphix'
import { Direction } from '../../engine/math/Direction'
import { IRect } from '../../engine/math/Rect'
import { IUpdatable } from '../../interface/IUpdatable'
import { Flogger } from '../../service/Flogger'
import { AIDebugConstants } from '../../utils/Constants'
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
    currentJumperGraphics: Graphix

    groundPather: IGroundPatherAI
    aiColor: number = Math.floor(Math.random() * 16777215)
    debugContainer: Container

    constructor(options: GroundPatherDebuggerOptions) {
        this.groundPather = options.groundPather

        this.createDebugGraphics()
    }

    update() {
        const currentGroundRect = this.target.currentGroundRect
        const currentDistanceFromEdge = this.groundPather.currentDistanceFromEdge
        const currentNode = this.groundPather.currentNode
        const groundIndicatorDistance = this.debugValues.groundIndicatorDistance
        const groundIndicatorBleedAmount = this.debugValues.groundIndicatorBleedAmount
        const targetDotDistance = this.debugValues.targetDotDistance
        const targetDotSize = this.debugValues.targetDotSize
        const targetDirection = this.target.direction

        // Target dot
        this.currentTargetGraphics.x = this.target.x + (targetDotSize / 2)
        this.currentTargetGraphics.y = this.target.y + targetDotDistance

        if (this.target.isOnGround && exists(currentGroundRect)) {
            // Ground indicator
            if (AIDebugConstants.ShowCurrentGroundIndicator) {
                this.currentGroundGraphics.x = currentGroundRect.x - (groundIndicatorBleedAmount / 2)
                this.currentGroundGraphics.y = currentGroundRect.y + groundIndicatorDistance
                this.currentGroundGraphics.width = currentGroundRect.width + groundIndicatorBleedAmount
            }

            // Range indicator
            if (AIDebugConstants.ShowCurrentGroundRange) {
                this.currentRangeGraphics.x = this.target.x
                this.currentRangeGraphics.y = currentGroundRect.y + (groundIndicatorDistance * 2)
                this.currentRangeGraphics.width = currentDistanceFromEdge
                if (targetDirection === Direction.Left) {
                    this.currentRangeGraphics.x -= this.currentRangeGraphics.width
                }
            }

            // Node inidicator
            if (AIDebugConstants.ShowCurrentNode && exists(currentNode)) {
                this.currentNodeGraphics.alpha = 1
                this.currentNodeGraphics.x = currentNode.x
                this.currentNodeGraphics.y = currentNode.y
            } else {
                this.currentNodeGraphics.alpha = 0
            }
        }

        if (AIDebugConstants.ShowGroundJumperSensors) {
            this.currentJumperGraphics.x = this.target.x - this.currentJumperGraphics.halfWidth 
            this.currentJumperGraphics.y = this.target.y
        }
    }

    createDebugGraphics() {
        Flogger.log('GroundPatherDebugger', 'createDebugGraphics')
        const camera = Camera.getInstance()
        const targetDotSize = this.debugValues.targetDotSize
        const graphix = []
        
        this.debugContainer = new Container()
        this.currentTargetGraphics = new Graphix({ alpha: 0.5 })
        this.currentGroundGraphics = new Graphix({ alpha: 0.25 })
        this.currentRangeGraphics = new Graphix()
        this.currentNodeGraphics = new Graphix()
        this.currentJumperGraphics = new Graphix({ alpha: 0.25 })

        // Configured graphics
        if (AIDebugConstants.ShowCurrentGroundIndicator)
            graphix.push(this.currentGroundGraphics)
        if (AIDebugConstants.ShowCurrentGroundRange)
            graphix.push(this.currentRangeGraphics)
        if (AIDebugConstants.ShowAIBadge)
            graphix.push(this.currentTargetGraphics)
        if (AIDebugConstants.ShowCurrentNode)
            graphix.push(this.currentNodeGraphics)
        if (AIDebugConstants.ShowGroundJumperSensors)
            graphix.push(this.currentJumperGraphics)

        // Graphic drawing
        for (var i in graphix) {
            const g = graphix[i]
            const isCurrentNode = (g === this.currentNodeGraphics)

            if (isCurrentNode) g.lineStyle(1, this.aiColor)
            g.beginFill(isCurrentNode ? 0xFFFFFF : this.aiColor)
            g.drawRect(0, 0, targetDotSize, targetDotSize)
            g.blendMode = PIXI.BLEND_MODES.COLOR_BURN

            this.debugContainer.addChild(g)
        }

        // Jumper graphics
        console.log(this.groundPather.jumper.sensor as IRect)
        this.currentJumperGraphics.width = this.groundPather.jumper.sensor.width
        this.currentJumperGraphics.height = this.groundPather.jumper.sensor.height

        // Graphic initial modification
        this.currentTargetGraphics.rotation = 45 * (Math.PI / 180)
        this.currentGroundGraphics.height = this.debugValues.groundIndicatorHeight
        this.currentRangeGraphics.height = this.debugValues.groundIndicatorHeight
        this.currentNodeGraphics.width = 3
        this.currentNodeGraphics.height = 3

        camera.stage.addChildAtLayer(this.debugContainer, CameraLayer.DebugOverlay)
    }

    get target() {
        return this.groundPather.target
    }

    get jumper() {
        return this.groundPather.jumper
    }
}
