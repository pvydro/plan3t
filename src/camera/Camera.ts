import { Key } from 'ts-keycode-enum'
import { IVector2, Vector2 } from '../engine/math/Vector2'
import { InputEvents, InputProcessor } from '../input/InputProcessor'
import { IUpdatable } from '../interface/IUpdatable'
import { CameraDebuggerPlugin } from './plugin/CameraDebuggerPlugin'
import { CameraStage } from './CameraStage'
import { Viewport } from './Viewport'
import { CameraFlashOptions, CameraFlashPlugin } from './plugin/CameraFlashPlugin'
import { ClientPlayer, PlayerConsciousnessState } from '../cliententity/clientplayer/ClientPlayer'

export interface ICamera extends IUpdatable {
    viewport: Viewport
    stage: CameraStage
    resize(width: number, height: number): void
    toScreen(point: Vector2 | PIXI.ObservablePoint): IVector2
    follow(object: { x: number, y: number, width?: number, height?: number }): void
    shake(amount: number): void
    flash(options: CameraFlashOptions): void
}

export class Camera implements ICamera {
    private static INSTANCE: Camera
    private baseZoom: number = 3
    private baseWidth: number = 1280
    static Zero: Vector2 = Vector2.Zero
    static Mouse: Vector2 = Vector2.Zero
    _mouseX: number = 0
    _mouseY: number = 0
    _resizeScale: number = 1
    _target: { x: number, y: number, width?: number, height?: number } = undefined
    _zoom: number = this.baseZoom
    _stage: CameraStage
    _viewport: Viewport
    _x: number = 0
    _y: number = 0
    offsetEaseDamping: number = 10
    jitterDamping: number = 100
    jitterXCooldown: number = 10
    jitterYCooldown: number = 20
    maximumJitterCooldown: number = 500
    maximumJitterAmount: number = 20//10
    screenShakeDamping: number = 2
    screenShakeRecoveryDamping: number = 5
    maximumShakeAmount: number = 2
    targetOffset: IVector2 = Vector2.Zero
    offset: IVector2 = Vector2.Zero
    _targetJitterOffset: IVector2 = Vector2.Zero
    _jitterOffset: IVector2 = Vector2.Zero
    _targetScreenShakeOffset: IVector2 = Vector2.Zero
    _screenShakeOffset: IVector2 = Vector2.Zero

    cameraDebuggerPlugin: CameraDebuggerPlugin
    cameraFlashPlugin: CameraFlashPlugin

    public static getInstance() {
        if (Camera.INSTANCE === undefined) {
            Camera.INSTANCE = new Camera()
        }

        return Camera.INSTANCE
    }

    private constructor() {
        const camera = this

        this._viewport = new Viewport()
        this._stage = new CameraStage({ camera })
        this.cameraFlashPlugin = new CameraFlashPlugin({ camera })
        this.cameraDebuggerPlugin = new CameraDebuggerPlugin({ camera })

        this._stage.width = 1080
        this._stage.height = 720

        this.resize(window.innerWidth, window.innerHeight)
        this.setZoom(this.baseZoom)

        this.viewport.addChild(this.stage)
        this.viewport.addChild(this.cameraFlashPlugin)
        this.stage.addChild(this.cameraDebuggerPlugin)
        this.trackMousePosition()
    }

    update() {
        this.updateCameraSway()
        this.updateCameraShake()
        this.cameraFlashPlugin.update()

        if (this._target !== undefined) {
            this.offset.x += (this.targetOffset.x - this.offset.x) / this.offsetEaseDamping
            this.offset.y += ((this.targetOffset.y + this._jitterOffset.y) - this.offset.y) / this.offsetEaseDamping
            
            this.x = this._target.x + this.offset.x + this._jitterOffset.x + this._screenShakeOffset.x
            this.y = this._target.y + this.offset.y + this._screenShakeOffset.y
        }

        Camera.Zero = this.toScreen({ x: 0, y: 0 })
        Camera.Mouse = this.toScreen({ x: this._mouseX, y: this._mouseY })
    }

    updateMouseFollowOffset(mouseX: number, mouseY: number) {
        if (this.target instanceof ClientPlayer
        && (this.target as ClientPlayer).consciousnessState === PlayerConsciousnessState.Dead) {
            return
        }

        const viewportMiddleX = this.width / 2
        const viewportMiddleY = this.height / 2
        const offsetX = (mouseX - viewportMiddleX) / 20
        const offsetY = (mouseY - viewportMiddleY) / 15

        this.targetOffset.x = offsetX
        this.targetOffset.y = offsetY
    }

    updateCameraSway() {
        this._jitterOffset.x += (this._targetJitterOffset.x - this._jitterOffset.x) / this.jitterDamping
        this._jitterOffset.y += (this._targetJitterOffset.y - this._jitterOffset.y) / this.jitterDamping

        this.jitterXCooldown--
        this.jitterYCooldown--

        if (this.jitterXCooldown <= 0) {
            this.jitterXCooldown = Math.random() * this.maximumJitterCooldown

            this._targetJitterOffset.x = Math.random() * (this.maximumJitterAmount)
        }
        if (this.jitterYCooldown <= 0) {
            this.jitterYCooldown = Math.random() * this.maximumJitterCooldown

            this._targetJitterOffset.y = Math.random() * (this.maximumJitterAmount / 2)
        }
    }

    updateCameraShake() {
        this._screenShakeOffset.x += (this._targetScreenShakeOffset.x - this._screenShakeOffset.x) / this.screenShakeDamping
        this._screenShakeOffset.y += (this._targetScreenShakeOffset.y - this._screenShakeOffset.y) / this.screenShakeDamping

        this._targetScreenShakeOffset.x += (0 - this._targetScreenShakeOffset.x) / this.screenShakeRecoveryDamping
        this._targetScreenShakeOffset.y += (0 - this._targetScreenShakeOffset.y) / this.screenShakeRecoveryDamping
    }

    shake(amount: number) {
        const maximumShake = this.maximumShakeAmount * amount

        this._targetScreenShakeOffset.x = (Math.random() * maximumShake)
        this._targetScreenShakeOffset.y = (Math.random() * maximumShake)
        this._targetScreenShakeOffset.x *= (Math.random() > 0.5) ? 1 : -1
        this._targetScreenShakeOffset.y *= (Math.random() > 0.5) ? 1 : -1
    }

    flash(options: CameraFlashOptions) {
        this.cameraFlashPlugin.flash(options)
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

    trackMousePosition() {
        InputProcessor.on(InputEvents.MouseMove, (event: MouseEvent) => {
            this._mouseX = event.clientX
            this._mouseY = event.clientY

            this.updateMouseFollowOffset(this._mouseX, this._mouseY)
        })

        InputProcessor.on(InputEvents.KeyDown, (event: KeyboardEvent) => {
            if (event.which === Key.DownArrow) {
                this.setZoom(this.zoom - 0.1)
            } else if (event.which === Key.UpArrow) {
                this.setZoom(this.zoom + 0.1)
            }
        })
    }

    static toScreen(point: Vector2 | PIXI.ObservablePoint | { x: number, y: number }) {
        return Camera.getInstance().toScreen(point)
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
