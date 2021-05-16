import { Assets } from '../../asset/Assets'
import { Graphix } from '../../engine/display/Graphix'
import { Sprite } from '../../engine/display/Sprite'
import { TextSprite, TextSpriteAlign, TextSpriteOptions } from '../../engine/display/TextSprite'
import { IDimension } from '../../engine/math/Dimension'
import { IVector2 } from '../../engine/math/Vector2'
import { Constants, DebugConstants } from '../../utils/Constants'
import { Defaults } from '../../utils/Defaults'
import { functionExists } from '../../utils/Utils'
import { IUIComponent, UIComponent, UIComponentOptions } from '../UIComponent'
import { UIButtonDarkenerPlugin, UIButtonDarkenerPluginOptions as UIButtonDarkenerOptions } from './plugins/UIButtonDarkenerPlugin'
import { UIButtonDebuggerPlugin } from './plugins/UIButtonDebuggerPlugin'
import { UIButtonToolipOptions, UIButtonTooltipPlugin } from './plugins/UIButtonTooltipPlugin'

export enum UIButtonState {
    Idle, Hovered, Triggered
}

export enum UIButtonType {
    Hold,
    Tap,
    ToggleTap,
    HoverOnly
}

export interface IUIButton extends IUIComponent {
    dimension: IDimension

    hover(): Promise<any>
    pressDown(): Promise<any>
    release(): Promise<any>
}

export interface UIButtonBackgroundOptions {
    idle?: string
    hovered?: string
    triggered?: string
    graphic?: Graphix
}

export interface UIButtonTextOptions extends TextSpriteOptions {
    alpha?: number
    offsetY?: number
}

export interface UIButtonOptions extends UIComponentOptions {
    type: UIButtonType
    text?: UIButtonTextOptions
    background?: UIButtonBackgroundOptions
    addClickListeners?: boolean
    darkenerOptions?: UIButtonDarkenerOptions
    tooltipOptions?: UIButtonToolipOptions

    onHold?: () => void
    onTrigger?: () => void
    onHover?: () => void
    onMouseOut?: () => void
    onRelease?: () => void
}

export class UIButton extends UIComponent implements IUIButton {
    _backgroundGraphic?: Graphix
    _backgroundSprite?: Sprite
    _backgroundSpriteHovered?: Sprite
    _backgroundSpriteTriggered?: Sprite
    _state: UIButtonState
    _textSprite?: TextSprite
    type: UIButtonType
    isPushed: boolean = false
    listenersAdded: boolean = false

    plugins: any[] = []
    debuggerPlugin: UIButtonDebuggerPlugin
    tooltipPlugin: UIButtonTooltipPlugin

    extendedOnHold?: Function
    extendedOnTrigger?: Function
    extendedOnHover?: Function
    extendedOnMouseOut?: Function
    extendedOnRelease?: Function

    constructor(options: UIButtonOptions) {
        super(options)

        this.type = options.type
        this.extendedOnHold = options.onHold
        this.extendedOnTrigger = options.onTrigger
        this.extendedOnHover = options.onHover
        this.extendedOnMouseOut = options.onMouseOut
        this.extendedOnRelease = options.onRelease

        this.loadPlugins(options)
        this.applyBackgroundTexture(options)
        this.applyPluginInternals(options)
        this.applyMouseListeners(options.addClickListeners ?? true)
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
        this.backgroundSprite.interactive = true

        this.backgroundSprite.on('pointerover', () => {
            this.hover()
        })
        this.backgroundSprite.on('pointerout', () => {
            this.unhover()
        })

        if (addClickListeners) {
            this.backgroundSprite.on('pointerdown', () => {
                this.pressDown()
            })
            this.backgroundSprite.on('pointerup', () => {
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
            this._textSprite = textSprite
            const alignment = textOptions.align ?? TextSpriteAlign.Center
            const offsetY = textOptions.offsetY ?? 0
            const startY = -(this.textHeight / 2) + this.halfHeight

            this.textSprite.position.set(0, startY)
            this.textSprite.alpha = textOptions.alpha ?? 1
            this.textSprite.y += offsetY

            if (alignment === TextSpriteAlign.Left) {
                this.textSprite.x += Defaults.JustificationPadding
            } else if (alignment === TextSpriteAlign.Center) {
                this.textSprite.x += this.halfWidth - (this.textWidth / 2)
            }
            
            this.addChild(this._textSprite)
        }
    }

    applyBackgroundTexture(options: UIButtonOptions) {
        if (options.background !== undefined) {
            const background = options.background

            if (background.idle !== undefined) {
                const idle = PIXI.Texture.from(Assets.get(background.idle))
                const hovered = background.hovered ? PIXI.Texture.from(Assets.get(background.hovered)) : undefined
                const triggered = background.triggered ? PIXI.Texture.from(Assets.get(background.triggered)) : undefined
    
                this.backgroundSprite = new Sprite({ texture: idle })
                
                if (hovered !== undefined && background.hovered !== background.idle) {
                    this.backgroundSpriteHovered = new Sprite({ texture: hovered })
                }
                if (triggered !== undefined && background.triggered !== background.hovered) {
                    this.backgroundSpriteTriggered = new Sprite({ texture: triggered })
                }
            } else if (background.graphic !== undefined) {
                this.backgroundGraphic = background.graphic
            }
        }
    }

    loadPlugins(options: UIButtonOptions) {
        if (options.darkenerOptions)            this.plugins.push(new UIButtonDarkenerPlugin(this, options.darkenerOptions))
        if (options.tooltipOptions)             this.plugins.push(this.tooltipPlugin = new UIButtonTooltipPlugin(this, options.tooltipOptions))
        if (DebugConstants.ShowUIButtonDebug)   this.plugins.push(this.debuggerPlugin = new UIButtonDebuggerPlugin(this))
    }

    applyPluginInternals(options: UIButtonOptions) {
        if (this.tooltipPlugin) {
            this.tooltipPlugin.initialize()
            this.addChild(this.tooltipPlugin)
        }
        if (this.debuggerPlugin) {
            this.debuggerPlugin.initialize()
            this.addChildAt(this.debuggerPlugin, 0)
        }
    }

    set state(value: UIButtonState) {
        this._state = value
    }

    set backgroundSprite(value: Sprite) {
        if (this._backgroundSprite !== undefined) {
            this._backgroundSprite.demolish()
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

    set backgroundGraphic(value: Graphix) {
        if (this._backgroundGraphic !== undefined) {
            this.removeChild(this._backgroundGraphic)
        }

        this._backgroundGraphic = value
        this.addChild(this._backgroundGraphic)
    }

    get backgroundSprite() {
        return this._backgroundSprite
    }

    get backgroundGraphic() {
        return this._backgroundGraphic
    }

    get textSprite() {
        return this._textSprite
    }

    get backgroundWidth() {
        return this.backgroundSprite ? this.backgroundSprite.width : 0
    }

    get backgroundHeight() {
        return this.backgroundSprite ? this.backgroundSprite.height : 0
    }

    get dimension() {
        return { width: this.backgroundWidth, height: this.backgroundHeight }
    }

    get halfWidth() {
        return this.backgroundWidth / 2
    }

    get halfHeight() {
        return this.backgroundHeight / 2
    }

    get textWidth() {
        return this.textSprite ? this.textSprite.textWidth : 0
    }

    get textHeight() {
        return this.textSprite ? this.textSprite.textHeight : 0
    }

    get bottom() {
        return this.backgroundHeight
    }

    get right() {
        return this.backgroundWidth
    }
}
