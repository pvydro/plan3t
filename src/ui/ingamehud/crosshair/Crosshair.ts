import { Camera } from '../../../camera/Camera'
import { ClientPlayer } from '../../../cliententity/clientplayer/ClientPlayer'
import { Graphix } from '../../../engine/display/Graphix'
import { IVector2, Vector2 } from '../../../engine/math/Vector2'
import { InputEvents, InputProcessor } from '../../../input/InputProcessor'
import { GameStateID, GameStateManager } from '../../../manager/gamestatemanager/GameStateManager'
import { GameWindow } from '../../../utils/Constants'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { CrosshairAnimator, ICrosshairAnimator } from './CrosshairAnimator'
import { CrosshairCursor, ICrosshairCursor } from './CrosshairCursor'

export interface ICrosshair extends IUIComponent {
    nodeOne: Graphix
    nodeTwo: Graphix
    nodeThree: Graphix
    nodes: Graphix[]
    state: CrosshairState
    targetRotation: number
    setStateWithDelay(value: CrosshairState, delay: number): void
    setTargetRotation(value: number): void
    resetTargetRotation(value: number): void
}

export enum CrosshairState {
    Gameplay, Cursor
}

export class Crosshair extends UIComponent implements ICrosshair {
    private static Instance: Crosshair
    _state: CrosshairState = CrosshairState.Gameplay
    _targetRotation: number = 0
    
    stateSetTimer: number
    pointerCursor: ICrosshairCursor
    animator: ICrosshairAnimator

    mousePos: IVector2 = Vector2.Zero
    mouseDistance: IVector2 = Vector2.Zero
    positionOffset: IVector2 = Vector2.Zero
    growthOffset: number = 0
    targetGrowthOffset: number 
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
        const crosshair = this

        this.pointerCursor = new CrosshairCursor({ crosshair })
        this.animator = new CrosshairAnimator({ crosshair })

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
        let positionOffsetDivisor = 20
        const posOffset = {
            x: this.state === CrosshairState.Cursor ? -3 : 0,
            y: this.state === CrosshairState.Cursor ? 12 : 0
        }
        
        if (GameStateManager.getCurrentStateID() === GameStateID.StartMenu
        || GameStateManager.getCurrentStateID() === GameStateID.WagerMenu
        || GameStateManager.getCurrentStateID() === GameStateID.WaveRunnerMenu) {
            positionOffsetDivisor = 2
            posOffset.y += 152
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

    async show() {
        await this.animator.show(true)
    }

    async hide() {
        await this.animator.show(false)
    }

    forceHide() {
        this.alpha = 0
    }

    setStateWithDelay(state: CrosshairState, delay: number) {
        this.resetStateSetTimer()

        this.stateSetTimer = window.setTimeout(() => {
            this.state = state
        }, delay)
    }

    resetStateSetTimer() {
        if (this.stateSetTimer) {
            window.clearTimeout(this.stateSetTimer)
            this.stateSetTimer = undefined
        }
    }

    setTargetRotation(value: number) {
        this._targetRotation = value
    }

    resetTargetRotation(): void {
        this._targetRotation = 0
    }

    get targetRotation() {
        return this._targetRotation
    }

    set state(value: CrosshairState) {
        this.resetStateSetTimer()

        this._state = value
    }

    get state() {
        return this._state
    }
}
