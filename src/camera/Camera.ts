import { WindowSize, WorldSize } from '../utils/Constants'
import * as Viewport from 'pixi-viewport'
import { IUpdatable } from '../interface/IUpdatable'
import { InputProcessor } from '../input/InputProcessor'

export interface ICamera extends IUpdatable {
    viewport: Viewport
    addChild(child: any)
    follow(child: any)
}

export interface CameraFollowOptions {
    followDamping: number
}

export class Camera implements ICamera {
    _viewport: Viewport
    _offsetEaseDamping = 5
    target: any
    targetOffset: PIXI.IPoint = new PIXI.Point(0, 0)
    offset: PIXI.IPoint = new PIXI.Point(0, 0)
    followDamping: number = 5


    constructor() {
        this._viewport = this.viewport
        this._viewport.position.set(
            (0 - (this.viewport.screenWidth / 2)) * -1,
            (0 - (this.viewport.screenWidth / 2)) * -1
        )

        InputProcessor.on('mousemove', (event: MouseEvent) => {
            const mouseX = event.clientX
            const mouseY = event.clientY
            this.updateMousePosition(mouseX, mouseY)
        })
    }

    update() {
        this.offset.x += (this.targetOffset.x - this.offset.x) / this._offsetEaseDamping
        this.offset.y += (this.targetOffset.y - this.offset.y) / this._offsetEaseDamping

        const projectedTargetPos = this.target ? { x: this.target.x, y: this.target.y } : { x: 0, y: 0 }
        const targetPosWithMouseOffset = new PIXI.Point(projectedTargetPos.x + this.offset.x, projectedTargetPos.y + this.offset.y)

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
        return this._viewport = this._viewport ? this._viewport : new Viewport({
            screenWidth: WindowSize.width,
            screenHeight: WindowSize.height,
            worldWidth: WorldSize.width,
            worldHeight: WorldSize.height
        })
    }

    get defaultFollowOptions() {
        return {
            followDamping: 5
        }
    }
}