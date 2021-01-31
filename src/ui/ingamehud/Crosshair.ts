import { Camera } from '../../camera/Camera'
import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { Container } from '../../engine/display/Container'
import { Graphix } from '../../engine/display/Graphix'
import { IVector2, Vector2 } from '../../engine/math/Vector2'
import { InputProcessor } from '../../input/InputProcessor'
import { IUpdatable } from '../../interface/IUpdatable'

export interface ICrosshair extends IUpdatable {

}

export enum CrosshairState {
    Gameplay
}

export class Crosshair extends Container implements ICrosshair {
    private static INSTANCE: Crosshair
    
    state: CrosshairState = CrosshairState.Gameplay

    mousePos: IVector2 = Vector2.Zero
    mouseDistance: IVector2 = Vector2.Zero
    growthOffset: number = 0
    targetGrowthOffset: number = 0
    mouseDistanceGrowthDivisor: number = 25
    growthDamping: number = 2

    nodeOne: Graphix = this.constructNode()
    nodeTwo: Graphix = this.constructNode()
    nodeThree: Graphix = this.constructNode()
    nodes: Graphix[] = [ this.nodeOne, this.nodeTwo, this.nodeThree ]
    nodeDistance: number = 3

    
    static getInstance() {
        if (Crosshair.INSTANCE === undefined) {
            Crosshair.INSTANCE = new Crosshair()
        }
        return Crosshair.INSTANCE
    }

    private constructor() {
        super()

        for (var i in this.nodes) {
            const node = this.nodes[i]
            this.addChild(node)
        }

        this.styleNodes()
        this.followMouse()
    }

    followMouse() {
        InputProcessor.on('mousemove', (ev) => {
            this.mousePos.x = ev.clientX
            this.mousePos.y = ev.clientY
        })
    }

    update() {
        this.growWithMouseDistance()

        this.x = this.mousePos.x
        this.y = this.mousePos.y

        this.growthOffset += (this.targetGrowthOffset - this.growthOffset) / this.growthDamping

        this.applyGrowthOffsetToNodes()
    }
    
    growWithMouseDistance() {
        const mousePos = Camera.Mouse
        const player = ClientPlayer.getInstance()
        
        if (player !== undefined) {
            const playerPos = player.position

            this.mouseDistance.x = playerPos.x - mousePos.x
            this.mouseDistance.y = playerPos.y - mousePos.y

            const diffX = Math.abs(this.mouseDistance.x)
            const diffY = Math.abs(this.mouseDistance.y)
            const diff = (diffX + diffY) / 1.5

            this.targetGrowthOffset = diff / this.mouseDistanceGrowthDivisor
        }
    }

    applyGrowthOffsetToNodes() {
        this.nodeTwo.x = -this.nodeDistance - this.growthOffset
        this.nodeThree.x = this.nodeDistance + this.growthOffset
    }

    constructNode(): Graphix {
        const graphics = new Graphix()

        graphics.beginFill(0xffffff)
        graphics.drawRect(0, 0, 1, 1)
        graphics.endFill()

        return graphics
    }

    styleNodes() {
        switch (this.state) {
            case CrosshairState.Gameplay:

                this.nodeTwo.x = -this.nodeDistance
                this.nodeTwo.y = -2
                this.nodeTwo.height = 5

                this.nodeThree.x = this.nodeDistance
                this.nodeThree.y = -2
                this.nodeThree.height = 5

                break
        }

        this.scale.set(5, 5)
    }
}
