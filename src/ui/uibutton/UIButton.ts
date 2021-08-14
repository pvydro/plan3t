import { Graphix } from '../../engine/display/Graphix'
import { TextSprite, TextSpriteAlign, TextSpriteOptions } from '../../engine/display/TextSprite'
import { IDimension } from '../../engine/math/Dimension'
import { importantLog } from '../../service/Flogger'
import { DebugConstants } from '../../utils/Constants'
import { Defaults } from '../../utils/Defaults'
import { functionExists } from '../../utils/Utils'
import { IUIComponent, UIComponent, UIComponentOptions } from '../UIComponent'
import { UIButtonDarkenerPlugin, UIButtonDarkenerPluginOptions as UIButtonDarkenerOptions } from './plugins/UIButtonDarkenerPlugin'
import { UIButtonDebuggerPlugin } from './plugins/UIButtonDebuggerPlugin'
import { UIButtonNudgeOptions, UIButtonNudgePlugin } from './plugins/UIButtonNudgePlugin'
import { UIButtonToolipOptions, UIButtonTooltipPlugin } from './plugins/UIButtonTooltipPlugin'
import { IUIButtonBackground, UIButtonBackground } from './UIButtonBackground'

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
    background: IUIButtonBackground
    extendedOnHold?: Function
    extendedOnTrigger?: Function
    extendedOnHover?: Function
    extendedOnMouseOut?: Function
    extendedOnRelease?: Function

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
    nudgeOptions?: UIButtonNudgeOptions

    onHold?: () => void
    onTrigger?: () => void
    onHover?: () => void
    onMouseOut?: () => void
    onRelease?: () => void
}

export class UIButton extends UIComponent implements IUIButton {
    _state: UIButtonState
    _textSprite?: TextSprite
    type: UIButtonType
    background: UIButtonBackground
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

        this.background = new UIButtonBackground({ button: this })

        this.loadPlugins(options)
        this.applyBackgroundTexture(options)
        this.applyPluginInternals(options)
        this.applyMouseListeners(options.addClickListeners ?? true)
        this.applyText(options)
    }

    async hover() {
        if (this.state === UIButtonState.Hovered) return
        
        this.state = UIButtonState.Hovered

        if (functionExists(this.extendedOnHover)) {
            this.extendedOnHover()
        }
    }

    async unhover() {
        this.state = UIButtonState.Idle

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

        if (functionExists(this.extendedOnHold)) {
            this.extendedOnHold()
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
        
        if (functionExists(this.extendedOnTrigger)) {
            this.extendedOnTrigger()
        }
    }

    applyMouseListeners(addClickListeners?: boolean) {
        if (this.interactiveSprite) {
            this.interactiveSprite.interactive = true
    
            this.interactiveSprite.on('pointerover', () => {
                this.hover()
            })
            this.interactiveSprite.on('pointerout', () => {
                this.unhover()
            })
    
            if (addClickListeners) {
                this.interactiveSprite.on('pointerdown', () => {
                    this.pressDown()
                })
                this.interactiveSprite.on('pointerup', () => {
                    this.release()
                })
            }
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
        this.background.applyBackgroundTexture(options.background)

        this.addChild(this.background)
    }

    loadPlugins(options: UIButtonOptions) {
        if (options.darkenerOptions)            this.plugins.push(new UIButtonDarkenerPlugin(this, options.darkenerOptions))
        if (options.nudgeOptions)               this.plugins.push(new UIButtonNudgePlugin(this, options.nudgeOptions))
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
        this.background.refreshBackgroundBasedOnState(value)
    }

    get interactiveSprite() {
        return this.backgroundSprite
    }

    get backgroundSprite() {
        return this.background.backgroundSprite
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
