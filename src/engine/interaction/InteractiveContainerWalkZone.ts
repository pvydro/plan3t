import { IUpdatable } from '../../interface/IUpdatable'
import { Container, IContainer } from '../display/Container'
import { Graphix } from '../display/Graphix'
import { Tween } from '../display/tween/Tween'
import { IRect } from '../math/Rect'
import { InteractiveContainerCallbacks } from './InteractiveContainer'

export interface IInteractiveContainerWalkZone extends IContainer, InteractiveContainerCallbacks, IUpdatable {

}

export interface InteractiveContainerWalkZoneOptions {
    interactiveBounds: IRect
    interactiveOffsetX?: number
}

export enum InteractiveContainerWalkZoneState {
    Shown,
    Hidden
}

export class InteractiveContainerWalkZone extends Container implements IInteractiveContainerWalkZone {
    state: InteractiveContainerWalkZoneState = InteractiveContainerWalkZoneState.Hidden
    interactiveBounds: IRect
    interactiveOffsetX: number = 0
    nodeDistance: number = 5
    nodeStartDistance: number = 10
    nodeIntroDamping: number = 20
    nodeGrowthDamping: number = 5
    fadeOutAnim: TweenLite
    fadeInAlpha: number = 0.25
    
    targetNodeOneX: number
    targetNodeTwoX: number
    targetNodeHeight: number = 0
    nodeOne: Graphix = this.constructNode()
    nodeTwo: Graphix = this.constructNode()
    nodes: Graphix[] = [ this.nodeOne, this.nodeTwo ]

    constructor(options: InteractiveContainerWalkZoneOptions) {
        super()

        this.interactiveBounds = options.interactiveBounds
        this.interactiveOffsetX = options.interactiveOffsetX

        for (const i in this.nodes) {
            const node = this.nodes[i]
            node.height = this.nodeHeight
            node.y += (this.interactiveBounds.height * 0.125)
            this.addChild(node)
        }

        this.nodeOne.x = this.interactiveOffsetX - (this.interactiveBounds.width / 2) - this.nodeStartDistance
        this.nodeTwo.x = this.interactiveOffsetX + (this.interactiveBounds.width / 2) + this.nodeStartDistance

        this.targetNodeOneX = this.nodeOne.x
        this.targetNodeTwoX = this.nodeTwo.x

        this.fadeOutAnim = Tween.to(this, {
            alpha: 0,
            duration: 0.25
        })
    }

    update() {
        this.nodeOne.x += (this.targetNodeOneX - this.nodeOne.x) / this.nodeIntroDamping
        this.nodeTwo.x += (this.targetNodeTwoX - this.nodeTwo.x) / this.nodeIntroDamping
        
        if (this.targetNodeHeight === 0 && this.nodeOne.height <= 0.1) {
            this.nodeOne.height = 0
            this.nodeTwo.height = 0
        } else {
            this.nodeOne.height += (this.targetNodeHeight - this.nodeOne.height) / this.nodeGrowthDamping
            this.nodeTwo.height += (this.targetNodeHeight - this.nodeTwo.height) / this.nodeGrowthDamping
        }

        switch (this.state) {
            case InteractiveContainerWalkZoneState.Shown:
                if (this.alpha >= this.fadeInAlpha - 0.01) {
                    this.alpha = this.fadeInAlpha
                } else if (this.alpha !== this.fadeInAlpha) {
                    this.alpha += (this.fadeInAlpha - this.alpha) / 5
                } 
                break
            case InteractiveContainerWalkZoneState.Hidden:
                break
        }
    }

    onEnter() {
        this.fadeOutAnim.pause()
        this.state = InteractiveContainerWalkZoneState.Shown

        this.targetNodeOneX = this.interactiveOffsetX - (this.interactiveBounds.width / 2)
        this.targetNodeTwoX = this.interactiveOffsetX + (this.interactiveBounds.width / 2)
        this.targetNodeHeight = this.nodeHeight
    }

    onExit() {
        this.fadeOutAnim.restart()
        this.fadeOutAnim.play()
        this.state = InteractiveContainerWalkZoneState.Hidden

        this.targetNodeOneX = this.interactiveOffsetX - (this.interactiveBounds.width / 2) - this.nodeStartDistance
        this.targetNodeTwoX = this.interactiveOffsetX + (this.interactiveBounds.width / 2) + this.nodeStartDistance
        this.targetNodeHeight = 0
    }

    constructNode(): Graphix {
        const graphics = new Graphix()

        graphics.beginFill(0xffffff)
        graphics.drawRect(0, 0, 1, 1)
        graphics.endFill()
        graphics.pivot.set(0, 0)

        return graphics
    }

    get nodeHeight() {
        return (this.interactiveBounds.height * 0.75)
    }
}

