import { Camera } from '../../../camera/Camera'
import { ClientPlayer } from '../../../cliententity/clientplayer/ClientPlayer'
import { Container } from '../../../engine/display/Container'
import { Graphix } from '../../../engine/display/Graphix'
import { IVector2, Vector2 } from '../../../engine/math/Vector2'
import { InputEvents, InputProcessor } from '../../../input/InputProcessor'
import { IUpdatable } from '../../../interface/IUpdatable'
import { GameWindow } from '../../../utils/Constants'
import { UIComponent } from '../../UIComponent'
import { CrosshairCursor, ICrosshairCursor } from './CrosshairCursor'

export interface ICrosshair extends IUpdatable {
    nodeOne: Graphix
    nodeTwo: Graphix
    nodeThree: Graphix
    nodes: Graphix[]
    state: CrosshairState
}

export enum CrosshairState {
    Gameplay, Cursor
}

export class Crosshair extends UIComponent implements ICrosshair {
    private static Instance: Crosshair
    
    _state: CrosshairState = CrosshairState.Gameplay
    pointerCursor: ICrosshairCursor

    mousePos: IVector2 = Vector2.Zero
    mouseDistance: IVector2 = Vector2.Zero
    positionOffset: IVector2 = Vector2.Zero
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
        if (Crosshair.Instance === undefined) {
            Crosshair.Instance = new Crosshair()
        }
        return Crosshair.Instance
    }

    private constructor() {
        super()

        this.pointerCursor = new CrosshairCursor({ crosshair: this })

        for (const i in this.nodes) {
            const node = this.nodes[i]
            this.addChild(node)
        }

        this.styleNodes()
        this.followMouse()
    }

    followMouse() {
        InputProcessor.on(InputEvents.MouseMove, (ev) => {
            this.mousePos.x = ev.clientX
            this.mousePos.y = ev.clientY - GameWindow.topMarginHeight
        })
    }

    update() {
        if (this._state === CrosshairState.Gameplay) {
            this.growWithMouseDistance()
            this.applyGrowthOffsetToNodes()
        } else {
            this.targetGrowthOffset = 0
        }

        this.updatePositionOffset()
        this.applyStateToNodes()

        this.x = this.mousePos.x + this.positionOffset.x
        this.y = this.mousePos.y + this.positionOffset.y
        this.growthOffset += (this.targetGrowthOffset - this.growthOffset) / this.growthDamping

        this.pointerCursor.update()
    }

    private updatePositionOffset() {
        const positionOffsetDivisor = 20
        const posOffset = {
            x: this.state === CrosshairState.Cursor ? -3 : 0,
            y: this.state === CrosshairState.Cursor ? 12 : 0
        }

        this.positionOffset.x += (posOffset.x - this.positionOffset.x) / positionOffsetDivisor
        this.positionOffset.y += (posOffset.y - this.positionOffset.y) / positionOffsetDivisor
    }
    
    private growWithMouseDistance() {
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

    applyStateToNodes() {
        if (this._state === CrosshairState.Cursor) {
            this.pointerCursor.magnetizeNodes()
        } else {
            this.pointerCursor.demagnetizeNodes()
        }
    }

    constructNode(): Graphix {
        const graphics = new Graphix()

        graphics.beginFill(0xffffff)
        graphics.drawRect(0, 0, 1, 1)
        graphics.endFill()
        graphics.pivot.set(0, 0)

        return graphics
    }

    styleNodes() {
        this.nodeTwo.x = -this.nodeDistance
        this.nodeTwo.y = -2
        this.nodeTwo.height = 5

        this.nodeThree.x = this.nodeDistance
        this.nodeThree.y = -2
        this.nodeThree.height = 5

        this.scale.set(5, 5)
    }

    forceHide() {
        this.alpha = 0
    }

    set state(value: CrosshairState) {
        this._state = value
    }

    get state() {
        return this._state
    }
}
