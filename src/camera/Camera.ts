import { Key } from 'ts-keycode-enum'
import { IVector2, Vector2 } from '../engine/math/Vector2'
import { InputEvents, InputProcessor } from '../input/InputProcessor'
import { IUpdatable } from '../interface/IUpdatable'
import { CameraDebuggerPlugin } from './plugin/CameraDebuggerPlugin'
import { CameraStage } from './CameraStage'
import { Viewport } from './Viewport'
import { CameraFlashOptions, CameraFlashPlugin } from './plugin/CameraFlashPlugin'
import { ClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { CameraOverlayEffectsPlugin, ICameraOverlayEffectsPlugin } from './plugin/CameraOverlayEffectsPlugin'
import { CameraSwayPlugin, ICameraSwayPlugin } from './plugin/CameraSwayPlugin'
import { CameraShakePlugin, ICameraShakePlugin } from './plugin/CameraShakePlugin'
import { log } from '../service/Flogger'
import { double, exists } from '../utils/Utils'
import { EntityFlashOptions } from '../cliententity/plugins/EntityFlashPlugin'
import { CameraPlayerSynchPlugin, ICameraPlayerSynchPlugin } from './plugin/CameraPlayerSynchPlugin'
import { GameWindow } from '../utils/Constants'
import { CameraLetterboxPlugin } from './plugin/CameraLetterboxPlugin'
import { IReposition } from '../interface/IReposition'
import { PositionAnimateable } from '../engine/display/Animator'
import { PlayerConsciousnessState } from '../cliententity/clientplayer/ClientPlayerState'

export interface ICameraTarget {
    x: number
    y: number
    xVel: number
    yVel: number
    width?: number
    height?: number
}

export interface ICamera extends IUpdatable, IReposition {
    resize(width: number, height: number): void
    toScreen(point: IVector2 | PIXI.ObservablePoint): IVector2
    follow(object: {}): void
    clearFollowTarget(): void
    clear(): void
    shake(amount: number): void
    flash(options: CameraFlashOptions): void
    shakeAndFlash(shakeAmount: number, flashOptions?: EntityFlashOptions): void
    snapToTarget(): void
    viewport: Viewport
    stage: CameraStage
    offset: IVector2
    transformOffset: IVector2
    instantOffset: IVector2
    offsetEaseDamping: number
    target: ICameraTarget
    extraXOffset: number
    extraYOffset: number
    halfWidth: number
    halfHeight: number
}

export class Camera implements ICamera {
    private static Instance: Camera
    private baseZoom: number = 3.5
    private baseWidth: number = 1280
    static Zero: Vector2 = Vector2.Zero
    static Mouse: Vector2 = Vector2.Zero
    _mouseX: number = 0
    _mouseY: number = 0
    _resizeScale: number = 1
    _target: ICameraTarget = undefined
    _zoom: number = this.baseZoom
    _stage: CameraStage
    _viewport: Viewport
    _x: number = 0
    _y: number = 0
    extraXOffset: number = 0
    extraYOffset: number = 0
    baseYOffset: number = 24//-24
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
    cameraPlayerSynchPlugin: ICameraPlayerSynchPlugin
    cameraLetterboxPlugin: CameraLetterboxPlugin
    plugins: any[]

    public static getInstance() {
        if (Camera.Instance === undefined) {
            Camera.Instance = new Camera()
        }

        return Camera.Instance
    }

    private constructor() {
        const camera = this

        this._viewport = new Viewport()
        this._stage = new CameraStage({ camera })
        
        this.plugins = [
            this.cameraFlashPlugin = new CameraFlashPlugin(this),
            this.cameraDebuggerPlugin = new CameraDebuggerPlugin(this),
            this.cameraOverlayEffectsPlugin = new CameraOverlayEffectsPlugin(this),
            this.cameraSwayPlugin = new CameraSwayPlugin(this),
            this.cameraShakePlugin = new CameraShakePlugin(this),
            this.cameraPlayerSynchPlugin = new CameraPlayerSynchPlugin(this),
            this.cameraLetterboxPlugin = new CameraLetterboxPlugin(this)
        ]

        const stageWidth = 1080
        const stageHeight = 720
        this.stage.width = stageWidth
        this.stage.height = stageHeight
        
        this.viewport.addChild(this.stage)
        this.viewport.addChild(this.cameraFlashPlugin)
        this.viewport.addChild(this.cameraLetterboxPlugin)
        this.stage.addChild(this.cameraDebuggerPlugin)

        this.trackMousePosition()
        this.setZoom(this.baseZoom)

        this.reposition(true)
    }

    update() {
        for (var i in this.plugins) {
            const plugin = this.plugins[i]

            if (typeof plugin.update === 'function') {
                plugin.update()
            }
        }
        
        if (exists(this._target)) {
            this.offset.x += (this.transformOffset.x - this.offset.x) / this.offsetEaseDamping
            this.offset.y += ((this.transformOffset.y) - this.offset.y) / this.offsetEaseDamping
            this.mouseOffset.x += (this.targetMouseOffset.x - this.mouseOffset.x) / this.mouseFollowDamping
            this.mouseOffset.y += (this.targetMouseOffset.y - this.mouseOffset.y) / this.mouseFollowDamping

            this.targetX = this._target.x + this.offset.x + double(this.instantOffset.x)
                + this.extraXOffset + this.mouseOffset.x
            this.targetY = this._target.y + this.offset.y + double(this.instantOffset.y)
                + this.mouseOffset.y + this.instantOffset.y - ((GameWindow.topMarginHeight / this._zoom) * 1.5)
        }

        this.stage.x += this.instantOffset.x + this.transformOffset.x
        this.stage.y += this.instantOffset.y + this.transformOffset.y
        
        Camera.Zero = this.toScreen({ x: 0, y: 0 })
        Camera.Mouse = this.toScreen({ x: this._mouseX, y: this._mouseY })
        
        this.stage.update()
    }

    clear() {
        log('Camera', 'clear')

        this.stage.clearChildren()
    }

    updateMouseFollowOffset(mouseX: number, mouseY: number) {
        if (this.target instanceof ClientPlayer
        && (this.target as ClientPlayer).consciousnessState === PlayerConsciousnessState.Dead) {
            return
        }
        
        const viewportMiddleX = this.width / 2
        const viewportMiddleY = this.height / 2
        const offsetX = (mouseX - viewportMiddleX) / 20
        const offsetY = ((mouseY - viewportMiddleY) / 15) + this.baseYOffset
        
        this.targetMouseOffset.x = offsetX
        this.targetMouseOffset.y = offsetY
    }

    shake(amount: number) {
        this.cameraShakePlugin.shake(amount)
    }

    flash(options: CameraFlashOptions) {
        this.cameraFlashPlugin.flash(options)
    }

    shakeAndFlash(shakeAmount: number, flashOptions?: CameraFlashOptions) {
        flashOptions = flashOptions ?? { minimumBrightness: 0.4, maximumBrightness: 0.7 }

        this.shake(shakeAmount)
        this.flash(flashOptions)
    }

    follow(object: ICameraTarget) {
        log('Camera', 'follow', 'target')

        this._target = object
    }

    resize(width: number, height: number) {
        this._resizeScale = width / this.baseWidth

        this.setZoom(this._zoom)
    }

    reposition(addListener?: boolean) {
        if (addListener) {
            InputProcessor.on(InputEvents.Resize, () => {
                this.reposition(false)
            })
        }

        this.resize(window.innerWidth, GameWindow.fullWindowHeight)
        this.stage.x = GameWindow.halfWidth
    }

    setZoom(amount: number) {
        this._zoom = amount

        const resizeZoom = this._zoom * this._resizeScale

        this.stage.scale.set(resizeZoom, resizeZoom)
    }

    toScreen(point: Vector2 | PIXI.ObservablePoint | PositionAnimateable) {
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

        // TODO: Temporary
        InputProcessor.on(InputEvents.KeyDown, (event: KeyboardEvent) => {
            if (event.which === Key.DownArrow) {
                this.setZoom(this._zoom / 1.5)
            } else if (event.which === Key.UpArrow) {
                this.setZoom(this._zoom + 0.1)
            }
        })
    }

    clearFollowTarget() {
        log('Camera', 'clearFollowTarget')

        this._target = undefined
    }

    snapToTarget() {
        this.x = this._target.x + this.offset.x + double(this.instantOffset.x)
                + this.extraXOffset + this.mouseOffset.x
        this.y = this._target.y + this.offset.y + double(this.instantOffset.y)
            + this.mouseOffset.y + this.instantOffset.y - ((GameWindow.topMarginHeight / this._zoom) * 1.5)
    }

    static toScreen(point: Vector2 | PIXI.ObservablePoint | PositionAnimateable) {
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
        return GameWindow.fullWindowWidth
    }

    get height() {
        return GameWindow.fullWindowHeight
    }

    get halfWidth() {
        return this.width / 2
    }

    get halfHeight() {
        return this.height / 2
    }

    set x(value: number) {
        const newValue = -value * this.zoom
        this.stage.x = newValue + (this.width / 2)
    }

    set y(value: number) {
        const newValue = -value * this.zoom
        this.stage.y = newValue + (this.height / 2)
    }

    set targetX(value: number) {
        const newValue = -value * this.zoom
        this.stage.targetX = newValue + (this.width / 2)
    }

    set targetY(value: number) {
        const newValue = -value * this.zoom
        this.stage.targetY = newValue + (this.height / 2)
    }
}
