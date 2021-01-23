import { Container } from '../engine/display/Container'
import { IVector2, Vector2 } from '../engine/math/Vector2'
import { InputProcessor } from '../input/InputProcessor'
import { IUpdatable } from '../interface/IUpdatable'
import { CameraDebugger } from './CameraDebugger'
import { Viewport } from './Viewport'

export interface ICamera extends IUpdatable {
    viewport: Viewport
    stage: Container
    resize(width: number, height: number): void
    toScreen(point: Vector2 | PIXI.ObservablePoint): IVector2
}

export class Camera implements ICamera {
    private static INSTANCE: Camera
    private baseZoom: number = 3
    private baseWidth: number = 1280
    _resizeScale: number = 1
    _target: { x: number, y: number, width?: number, height?: number } = undefined
    _zoom: number = this.baseZoom
    _stage: Container
    _viewport: Viewport
    _x: number = 0
    _y: number = 0
    offsetEaseDamping = 10
    targetOffset: IVector2 = Vector2.Zero
    offset: IVector2 = Vector2.Zero

    cameraDebugger: CameraDebugger

    public static getInstance() {
        if (Camera.INSTANCE === undefined) {
            Camera.INSTANCE = new Camera()
        }

        return Camera.INSTANCE
    }

    private constructor() {
        this._stage = new Container()
        this._viewport = new Viewport()

        this._stage.width = 1080
        this._stage.height = 720

        this.resize(window.innerWidth, window.innerHeight)
        this.setZoom(this.baseZoom)

        this.viewport.addChild(this.stage)
        this.trackMousePosition()
    }

    initializeDebugger() {
        this.cameraDebugger = new CameraDebugger(this)
        this.stage.addChild(this.cameraDebugger)
    }

    trackMousePosition() {
        InputProcessor.on('mousemove', (event: MouseEvent) => {
            const mouseX = event.clientX
            const mouseY = event.clientY

            this.updateMousePosition(mouseX, mouseY)
        })
    }

    updateMousePosition(mouseX: number, mouseY: number) {
        const viewportMiddleX = this.width / 2
        const viewportMiddleY = this.height / 2
        const offsetX = (mouseX - viewportMiddleX) / 20
        const offsetY = (mouseY - viewportMiddleY) / 15

        this.targetOffset.x = offsetX
        this.targetOffset.y = offsetY
    }

    update() {
        if (this._target !== undefined) {
            this.offset.x += (this.targetOffset.x - this.offset.x) / this.offsetEaseDamping
            this.offset.y += (this.targetOffset.y - this.offset.y) / this.offsetEaseDamping
            
            this.x = this._target.x + this.offset.x
            this.y = this._target.y + this.offset.y
        }
    }

    follow(object: { x: number, y: number, width?: number, height?: number }) {
        this._target = object
    }

    resize(width: number, height: number) {
        this._resizeScale = width / this.baseWidth

        this.setZoom(this._zoom)
    }

    setZoom(amount: number) {
        this._zoom = amount

        const resizeZoom = this._zoom * this._resizeScale

        this.stage.scale.set(resizeZoom, resizeZoom)
    }

    toScreen(point: Vector2 | PIXI.ObservablePoint | { x: number, y: number }) {
        const newX = (point.x / this.zoom)
        - (this.stage.x / this.zoom)
        const newY = (point.y / this.zoom)
        - (this.stage.y / this.zoom)
        const newVec = new Vector2(newX, newY)

        return newVec
    }

    get target() {
        return this._target
    }

    get zoom() {
        return this._zoom * this._resizeScale
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
        const newValue = -value * this.zoom
        this.stage.x = newValue + (this.width / 2)
    }

    set y(value: number) {
        const newValue = -value * this.zoom
        this.stage.y = newValue + (this.height / 2)
    }
}
