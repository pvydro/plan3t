import { Key } from 'ts-keycode-enum'
import { IVector2, Vector2 } from '../engine/math/Vector2'
import { InputEvents, InputProcessor } from '../input/InputProcessor'
import { IUpdatable } from '../interface/IUpdatable'
import { CameraDebuggerPlugin } from './plugin/CameraDebuggerPlugin'
import { CameraStage } from './CameraStage'
import { Viewport } from './Viewport'
import { CameraFlashOptions, CameraFlashPlugin } from './plugin/CameraFlashPlugin'
import { ClientPlayer, PlayerConsciousnessState } from '../cliententity/clientplayer/ClientPlayer'
import { CameraOverlayEffectsPlugin, ICameraOverlayEffectsPlugin } from './plugin/CameraOverlayEffectsPlugin'
import { CameraSwayPlugin, ICameraSwayPlugin } from './plugin/CameraSwayPlugin'
import { CameraShakePlugin, ICameraShakePlugin } from './plugin/CameraShakePlugin'

export interface ICamera extends IUpdatable {
    viewport: Viewport
    stage: CameraStage
    offset: IVector2
    transformOffset: IVector2
    instantOffset: IVector2
    offsetEaseDamping: number
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
    offsetEaseDamping: number = 20
    targetMouseOffset: IVector2 = Vector2.Zero
    mouseOffset: IVector2 = Vector2.Zero
    mouseFollowDamping: number = 50
    offset: IVector2 = Vector2.Zero
    transformOffset: IVector2 = Vector2.Zero
    instantOffset: IVector2 = Vector2.Zero

    cameraDebuggerPlugin: CameraDebuggerPlugin
    cameraFlashPlugin: CameraFlashPlugin
    cameraOverlayEffectsPlugin: ICameraOverlayEffectsPlugin
    cameraSwayPlugin: ICameraSwayPlugin
    cameraShakePlugin: ICameraShakePlugin
    plugins: any[]

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
        
        this.cameraFlashPlugin = new CameraFlashPlugin(this)
        this.cameraDebuggerPlugin = new CameraDebuggerPlugin(this)
        this.cameraOverlayEffectsPlugin = new CameraOverlayEffectsPlugin(this)
        this.cameraSwayPlugin = new CameraSwayPlugin(this)
        this.cameraShakePlugin = new CameraShakePlugin(this)
        this.plugins = [
            this.cameraFlashPlugin, this.cameraDebuggerPlugin,
            this.cameraOverlayEffectsPlugin, this.cameraSwayPlugin,
            this.cameraShakePlugin
        ]

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
        for (var i in this.plugins) {
            const plugin = this.plugins[i]

            if (typeof plugin.update === 'function') {
                plugin.update()
            }
        }

        if (this._target !== undefined) {
            this.mouseOffset.x += (this.targetMouseOffset.x - this.mouseOffset.x) / this.mouseFollowDamping
            this.mouseOffset.y += (this.targetMouseOffset.y - this.mouseOffset.y) / this.mouseFollowDamping
            this.offset.x += (this.transformOffset.x - this.offset.x) / this.offsetEaseDamping
            this.offset.y += ((this.transformOffset.y) - this.offset.y) / this.offsetEaseDamping
                
            this.x = this._target.x + this.offset.x
                + this.mouseOffset.x + this.instantOffset.x
            this.y = this._target.y + this.offset.y
                + this.mouseOffset.y + this.instantOffset.y
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
        
        this.targetMouseOffset.x = offsetX
        this.targetMouseOffset.y = offsetY
    }

    shake(amount: number) {
        this.cameraShakePlugin.shake(amount)
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
