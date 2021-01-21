// import { WindowSize, WorldSize } from '../utils/Constants'
// import * as Viewport from 'pixi-viewport'
// import { IUpdatable } from '../interface/IUpdatable'
// import { InputProcessor } from '../input/InputProcessor'
// import { IVector2, Vector2 } from '../engine/math/Vector2'
// import { Key } from 'ts-keycode-enum'
// import { SlowMo } from 'gsap/all'

import { TARGETS } from 'pixi.js'
import { NumericLiteral } from 'typescript'
import { Container } from '../engine/display/Container'
import { IUpdatable } from '../interface/IUpdatable'
import { Viewport } from './Viewport'

// export interface ICamera extends IUpdatable {
//     viewport: Viewport
//     addChild(child: any)
//     follow(child: any)
// }

// export interface CameraFollowOptions {
//     followDamping: number
// }

// export class Camera implements ICamera {
//     private static INSTANCE: Camera
//     _viewport: Viewport
//     _offsetEaseDamping = 5
//     target: any
//     targetOffset: IVector2 = Vector2.Zero
//     offset: IVector2 = Vector2.Zero
//     followDamping: number = 5

//     public static getInstance() {
//         if (this.INSTANCE === undefined) {
//             this.INSTANCE = new Camera()
//         }

//         return this.INSTANCE
//     }

//     private constructor() {
//         this._viewport = this.viewport

//         // this._viewport.zoom(200)
//         // this._viewport.zoomPercent(3)

//         this.trackMousePosition()
//         this.addKeyListeners()
//     }

//     addKeyListeners() {
//         InputProcessor.on('keydown', (event: KeyboardEvent) => {
//             if (event.which === Key.DownArrow) {
//                 this.viewport.zoomPercent(-0.2)
//             } else if (event.which === Key.UpArrow) {
//                 this.viewport.zoomPercent(0.2)
//             }
//         })
//     }

//     trackMousePosition() {
//         InputProcessor.on('mousemove', (event: MouseEvent) => {
//             const mouseX = event.clientX
//             const mouseY = event.clientY

//             this.updateMousePosition(mouseX, mouseY)
//         })
//     }

//     update() {
//         // Calculate target offset with easings
//         this.offset.x += (this.targetOffset.x - this.offset.x) / this._offsetEaseDamping
//         this.offset.y += (this.targetOffset.y - this.offset.y) / this._offsetEaseDamping

//         const projectedTargetPos = this.target ? { 
//             x: this.target.x, 
//             y: this.target.y 
//         } : { x: 0, y: 0 }
//         const targetPosWithMouseOffset = new Vector2(projectedTargetPos.x + this.offset.x, projectedTargetPos.y + this.offset.y)

//         const targetX = projectedTargetPos.x//(targetPosWithMouseOffset.x - (this.viewport.width / 2)) * -1
//         const targetY = projectedTargetPos.y//(targetPosWithMouseOffset.y - (this.viewport.width / 2)) * -1
        
//         const currentViewportX = this._viewport.position.x
//         const currentViewportY = this._viewport.position.y
        
//         // Move viewport to target
//         // this._viewport.position.x += (targetX - currentViewportX) / this.followDamping
//         // this._viewport.position.y += (targetY - currentViewportY) / this.followDamping
//         this._viewport.position.x = targetX
//         this._viewport.position.y = targetY
//     }

//     updateMousePosition(mouseX: number, mouseY: number) {
//         const viewportMiddleX = this.viewport.position.x + this._viewport.width / 2
//         const viewportMiddleY = this._viewport.height / 2
//         const offsetX = 0//(mouseX - viewportMiddleX) / 20
//         const offsetY = 0//(mouseY - viewportMiddleY) / 15

//         this.targetOffset.x = offsetX
//         this.targetOffset.y = offsetY
//     }

//     addChild(child: any) {
//         this._viewport.addChild(child)
//     }
    
//     follow(child: any, options?: CameraFollowOptions) {
//         this.followDamping = options ? options.followDamping : this.defaultFollowOptions.followDamping

//         this.target = child
//         // this._viewport.follow(child)
//     }

//     get viewport() {
//         if (this._viewport === undefined) {
//             this._viewport = new Viewport({
//                 screenWidth: WindowSize.width,
//                 screenHeight: WindowSize.height,
//                 worldWidth: WorldSize.width,
//                 worldHeight: WorldSize.height
//             })

//             this._viewport.position.set(
//                 (0 - (this.viewport.screenWidth / 2)) * -1,
//                 (0 - (this.viewport.screenWidth / 2)) * -1
//             )
//         }

//         return this._viewport
//     }

//     get defaultFollowOptions() {
//         return {
//             followDamping: 5
//         }
//     }
// }

export interface ICamera extends IUpdatable {
    viewport: Viewport
    stage: Container
    resize(width: number, height: number): void
}

export class Camera implements ICamera {
    private static INSTANCE: Camera
    private baseZoom: number = 3
    private _target: { x: number, y: number } = undefined
    private _zoom: number = this.baseZoom
    private _stage: Container
    private _viewport: Viewport
    private _x: number = 0
    private _y: number = 0

    public static getInstance() {
        if (Camera.INSTANCE === undefined) {
            Camera.INSTANCE = new Camera()
        }

        return Camera.INSTANCE
    }

    private constructor() {
        // Has stage, at a fixed size, scaled by Viewport
        // Has Viewport, which scales with screen, holding stage, device-ratio-ing it
        this._stage = new Container()
        this._viewport = new Viewport()

        this._stage.width = 1080
        this._stage.height = 720

        this.setZoom(this.baseZoom)

        this.viewport.addChild(this.stage)
    }

    update() {
        if (this._target !== undefined) {
            this.x = this._target.x
            this.y = this._target.y
        }
    }

    follow(object: { x: number, y: number }) {
        this._target = object
    }

    resize(width: number, height: number) {

    }

    setZoom(amount: number) {
        this._zoom = amount

        this.stage.scale.set(this._zoom, this._zoom)
    }

    get viewport() {
        return this._viewport
    }

    get stage() {
        return this._stage
    }

    get width() {
        return window.innerWidth
    }

    get height() {
        return window.innerHeight
    }

    set x(value: number) {
        const newValue = -value * this._zoom
        this.stage.x = newValue + (this.width / 2)
    }

    set y(value: number) {
        const newValue = -value * this._zoom
        this.stage.y = newValue + (this.height / 2)
    }
}
