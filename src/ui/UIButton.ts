import { Assets, AssetUrls } from '../asset/Assets'
import { Sprite } from '../engine/display/Sprite'
import { InputProcessor } from '../input/InputProcessor'
import { IUIComponent, UIComponent } from './UIComponent'

export enum UIButtonState {
    Idle, Hovered, Triggered
}

export enum UIButtonType {
    Hold,
    Tap,
    ToggleTap,
}

export interface IUIButton extends IUIComponent {
    hover(): Promise<any>
    pressDown(): Promise<any>
    release(): Promise<any>
}

export interface UIButtonBackground {
    idle: string
    hovered?: string
    triggered?: string
}

export interface UIButtonOptions {
    type: UIButtonType
    text?: string
    background?: UIButtonBackground
    addClickListeners?: boolean
    onTrigger?: () => void
}

export class UIButton extends UIComponent implements IUIButton {
    _backgroundSprite?: Sprite
    _backgroundSpriteHovered?: Sprite
    _backgroundSpriteTriggered?: Sprite
    _state: UIButtonState
    type: UIButtonType
    text?: string

    isPushed: boolean = false
    listenersAdded: boolean = false
    extendedTrigger?: Function

    constructor(options: UIButtonOptions) {
        super()

        this.type = options.type
        this.text = options.text ?? undefined

        this.applyMouseListeners(options.addClickListeners)
        this.applyBackgroundTexture(options.background)
    }

    async hover() {
        if (this.state === UIButtonState.Hovered) return

        this.state = UIButtonState.Hovered
    }

    async unhover() {
        if (this.state !== UIButtonState.Hovered) return

        this.state = UIButtonState.Idle
    }

    async pressDown() {
        this.isPushed = true

        // Trigger if hold-action
        if (this.type === UIButtonType.Hold) {
            this.trigger()
        }
    }

    async release() {
        if (!this.isPushed) return

        // Trigger if tap-action
        if (this.isPushed) {
            this.isPushed = false

            if (this.type === UIButtonType.Tap || this.type === UIButtonType.ToggleTap) {
                this.trigger()
            }
        }

        this.state = UIButtonState.Idle
    }

    trigger() {
        if (this.type !== UIButtonType.Hold
        && this.state === UIButtonState.Triggered) {
            return
        }

        this.state = UIButtonState.Triggered
        
        // Execute passed through trigger
        if (this.extendedTrigger !== undefined
        && typeof this.extendedTrigger === 'function') {
            this.extendedTrigger()
        }
    }

    applyMouseListeners(addClickListeners?: boolean) {
        this.interactive = true

        this.on('mouseover', () => {
            this.hover()
        })
        this.on('mouseout', () => {
            this.unhover()
        })

        if (addClickListeners) {
            // TODO
            this.on('mousedown', () => {
                this.pressDown()
            })
            this.on('mouseup', () => {
                this.release()
            })
        }
    }

    applyBackgroundTexture(background?: UIButtonBackground) {
        if (background !== undefined) {
            const idle = PIXI.Texture.from(Assets.get(background.idle))
            const hovered = background.hovered ? PIXI.Texture.from(Assets.get(background.hovered)) : idle
            const triggered = background.triggered ? PIXI.Texture.from(Assets.get(background.triggered)) : hovered

            this.backgroundSprite = new Sprite({ texture: idle })

            if (hovered !== idle) {
                this.backgroundSpriteHovered = new Sprite({ texture: hovered })
            }
            if (triggered !== hovered) {
                this.backgroundSpriteTriggered = new Sprite({ texture: triggered })
            }
        }
    }

    set state(value: UIButtonState) {
        this._state = value
    }

    set backgroundSprite(value: Sprite) {
        if (this._backgroundSprite !== undefined) {
            this.removeChild(this._backgroundSprite)
        }

        this._backgroundSprite = value
        this.addChild(this._backgroundSprite)
    }

    set backgroundSpriteHovered(value: Sprite) {
        if (this._backgroundSpriteHovered !== undefined) {
            this.removeChild(this._backgroundSpriteHovered)
        }

        this._backgroundSpriteHovered = value
        this.addChild(this._backgroundSpriteHovered)
    }

    set backgroundSpriteTriggered(value: Sprite) {
        if (this._backgroundSpriteTriggered !== undefined) {
            this.removeChild(this._backgroundSpriteTriggered)
        }

        this._backgroundSpriteTriggered = value
        this.addChild(this._backgroundSpriteTriggered)
    }
}
