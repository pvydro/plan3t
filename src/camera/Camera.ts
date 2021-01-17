import { WindowSize, WorldSize } from '../utils/Constants'
import * as Viewport from 'pixi-viewport'
import { IUpdatable } from '../interface/IUpdatable'
import { InputProcessor } from '../input/InputProcessor'
import { IVector2, Vector2 } from '../engine/math/Vector2'
import { Key } from 'ts-keycode-enum'
import { SlowMo } from 'gsap/all'

export interface ICamera extends IUpdatable {
    viewport: Viewport
    addChild(child: any)
    follow(child: any)
}

export interface CameraFollowOptions {
    followDamping: number
}

export class Camera implements ICamera {
    private static INSTANCE: Camera
    _viewport: Viewport
    _offsetEaseDamping = 5
    target: any
    targetOffset: IVector2 = Vector2.Zero
    offset: IVector2 = Vector2.Zero
    followDamping: number = 5

    public static getInstance() {
        if (this.INSTANCE === undefined) {
            this.INSTANCE = new Camera()
        }

        return this.INSTANCE
    }

    private constructor() {
        this._viewport = this.viewport

        this.trackMousePosition()
        this.addKeyListeners()
    }

    addKeyListeners() {
        InputProcessor.on('keydown', (event: KeyboardEvent) => {
            if (event.which === Key.DownArrow) {
                this.viewport.zoomPercent(-0.2)
            } else if (event.which === Key.UpArrow) {
                this.viewport.zoomPercent(0.2)
            }
        })
    }

    trackMousePosition() {
        InputProcessor.on('mousemove', (event: MouseEvent) => {
            const mouseX = event.clientX
            const mouseY = event.clientY

            this.updateMousePosition(mouseX, mouseY)
        })
    }

    update() {
        // Calculate target offset with easings
        this.offset.x += (this.targetOffset.x - this.offset.x) / this._offsetEaseDamping
        this.offset.y += (this.targetOffset.y - this.offset.y) / this._offsetEaseDamping

        const projectedTargetPos = this.target ? { x: this.target.x, y: this.target.y } : { x: 0, y: 0 }
        const targetPosWithMouseOffset = new Vector2(projectedTargetPos.x + this.offset.x, projectedTargetPos.y + this.offset.y)

        const targetX = (targetPosWithMouseOffset.x - (this.viewport.screenWidth / 2)) * -1
        const targetY = (targetPosWithMouseOffset.y - (this.viewport.screenHeight / 2)) * -1
        
        const currentViewportX = this._viewport.position.x
        const currentViewportY = this._viewport.position.y
        
        // Move viewport to target
        this._viewport.position.x += (targetX - currentViewportX) / this.followDamping
        this._viewport.position.y += (targetY - currentViewportY) / this.followDamping
    }

    updateMousePosition(mouseX: number, mouseY: number) {
        const viewportMiddleX = this._viewport.screenWidth / 2
        const viewportMiddleY = this._viewport.screenHeight / 2
        const offsetX = (mouseX - viewportMiddleX) / 20
        const offsetY = (mouseY - viewportMiddleY) / 15

        this.targetOffset.x = offsetX
        this.targetOffset.y = offsetY
    }

    addChild(child: any) {
        this._viewport.addChild(child)
    }
    
    follow(child: any, options?: CameraFollowOptions) {
        this.followDamping = options ? options.followDamping : this.defaultFollowOptions.followDamping

        this.target = child
    }

    get viewport() {
        if (this._viewport === undefined) {
            this._viewport = new Viewport({
                screenWidth: WindowSize.width,
                screenHeight: WindowSize.height,
                worldWidth: WorldSize.width,
                worldHeight: WorldSize.height
            })

            this._viewport.position.set(
                (0 - (this.viewport.screenWidth / 2)) * -1,
                (0 - (this.viewport.screenWidth / 2)) * -1
            )
        }

        return this._viewport
    }

    get defaultFollowOptions() {
        return {
            followDamping: 5
        }
    }
}