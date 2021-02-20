import { Assets } from '../../asset/Assets'
import { Sprite } from '../../engine/display/Sprite'
import { TextSprite, TextSpriteOptions } from '../../engine/display/TextSprite'
import { IVector2 } from '../../engine/math/Vector2'
import { functionExists } from '../../utils/Utils'
import { IUIComponent, UIComponent } from '../UIComponent'
import { UIButtonDarkenerPlugin, UIButtonDarkenPluginOptions as UIButtonDarkenerPluginOptions } from './UIButtonDarkenPlugin'

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

export interface UIButtonBackgroundOptions {
    idle: string
    hovered?: string
    triggered?: string
}

export interface UIButtonTextOptions extends TextSpriteOptions {
    alpha?: number
}

export interface UIButtonOptions {
    type: UIButtonType
    text?: UIButtonTextOptions
    background?: UIButtonBackgroundOptions
    addClickListeners?: boolean
    anchor?: IVector2
    darkenerPluginOptions?: UIButtonDarkenerPluginOptions
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
    _textSprite?: TextSprite
    type: UIButtonType
    isPushed: boolean = false
    listenersAdded: boolean = false
    plugins: any[] = []

    extendedOnHold?: Function
    extendedOnTrigger?: Function
    extendedOnHover?: Function
    extendedOnMouseOut?: Function
    extendedOnRelease?: Function

    constructor(options: UIButtonOptions) {
        super()

        this.type = options.type
        this.extendedOnHold = options.onHold
        this.extendedOnTrigger = options.onTrigger
        this.extendedOnHover = options.onHover
        this.extendedOnMouseOut = options.onMouseOut
        this.extendedOnRelease = options.onRelease

        if (options.darkenerPluginOptions) {
            this.plugins.push(new UIButtonDarkenerPlugin(this, options.darkenerPluginOptions))
        }

        this.applyMouseListeners(options.addClickListeners)
        this.applyBackgroundTexture(options)
        this.applyText(options)
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
        this.state = UIButtonState.Idle

        // Execute passed through hover
        if (functionExists(this.extendedOnMouseOut)) {
            this.extendedOnMouseOut()
        }
    }

    async pressDown() {
        this.isPushed = true

        // Trigger if hold-action
        if (this.type === UIButtonType.Hold) {
            this.trigger()
        }

        this.extendedOnHold()
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
            this.on('pointerdown', () => {
                this.pressDown()
            })
            this.on('pointerup', () => {
                this.release()
            })
        }
    }
    
    applyText(options: UIButtonOptions) {
        const textOptions = options.text

        if (this._textSprite !== undefined) {
            this._textSprite.demolish()
        }

        if (textOptions !== undefined) {
            const textSprite = new TextSprite(textOptions)
            textSprite.position.set(-this.backgroundWidth, -this.backgroundHeight)

            textSprite.x += this.halfWidth - (textSprite.textWidth / 2)
            textSprite.y += this.halfHeight - (textSprite.textHeight / 2)
            
            this._textSprite = textSprite
            this.addChild(this._textSprite)
        }
    }

    applyBackgroundTexture(options: UIButtonOptions) {
        const background: UIButtonBackgroundOptions = options.background
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

    get backgroundSprite() {
        return this._backgroundSprite
    }

    get textSprite() {
        return this._textSprite
    }

    get backgroundWidth() {
        return this.backgroundSprite.width
    }

    get backgroundHeight() {
        return this.backgroundSprite.height
    }

    get halfWidth() {
        return this.backgroundSprite.halfWidth
    }

    get halfHeight() {
        return this.backgroundSprite.halfHeight
    }
}
