import { Assets } from '../../asset/Assets'
import { Sprite } from '../../engine/display/Sprite'
import { IVector2 } from '../../engine/math/Vector2'
import { functionExists } from '../../utils/Utils'
import { IUIComponent, UIComponent } from '../UIComponent'

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
    anchor?: IVector2
    onHold?: () => void
    onTrigger?: () => void
    onHover?: () => void
    onMouseOut?: () => void
    onRelease?: () => void
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

    extendedOnHold?: Function
    extendedOnTrigger?: Function
    extendedOnHover?: Function
    extendedOnMouseOut?: Function
    extendedOnRelease?: Function

    constructor(options: UIButtonOptions) {
        super()

        this.type = options.type
        this.text = options.text
        this.extendedOnHold = options.onHold
        this.extendedOnTrigger = options.onTrigger
        this.extendedOnHover = options.onHover
        this.extendedOnMouseOut = options.onMouseOut
        this.extendedOnRelease = options.onRelease

        this.applyMouseListeners(options.addClickListeners)
        this.applyBackgroundTexture(options)
    }

    async hover() {
        if (this.state === UIButtonState.Hovered) return
        
        this.state = UIButtonState.Hovered

        // Execute passed through hover
        if (functionExists(this.extendedOnHover)) {
            this.extendedOnHover()
        }
    }

    async unhover() {
        if (this.state !== UIButtonState.Hovered) return

        this.state = UIButtonState.Idle

        // Execute passed through hover
        if (functionExists(this.extendedOnMouseOut)) {
            this.extendedOnMouseOut()
        }
    }

    async pressDown() {
        console.log('Press down!')
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

        // Execute passed through release
        if (functionExists(this.extendedOnRelease)) {
            this.extendedOnRelease()
        }
    }

    trigger() {
        if (this.type !== UIButtonType.Hold
        && this.state === UIButtonState.Triggered) {
            return
        }

        this.state = UIButtonState.Triggered
        
        // Execute passed through trigger
        if (functionExists(this.extendedOnTrigger)) {
            this.extendedOnTrigger()
        }
    }

    applyMouseListeners(addClickListeners?: boolean) {
        this.interactive = true

        this.on('pointerover', () => {
            this.hover()
        })
        this.on('pointerout', () => {
            this.unhover()
        })

        if (addClickListeners) {
            // TODO
            this.on('pointerdown', () => {
                this.pressDown()
            })
            this.on('pointerup', () => {
                this.release()
            })
        }
    }

    applyBackgroundTexture(options?: UIButtonOptions) {
        const background: UIButtonBackground = options ? options.background : undefined
        const anchor = options.anchor
        
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

            if (anchor !== undefined) {
                this._backgroundSprite.anchor.set(anchor.x, anchor.y)
                if (this._backgroundSpriteHovered) this.backgroundSpriteHovered.anchor.set(anchor.x, anchor.y)
                if (this._backgroundSpriteTriggered) this.backgroundSpriteHovered.anchor.set(anchor.x, anchor.y)
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
