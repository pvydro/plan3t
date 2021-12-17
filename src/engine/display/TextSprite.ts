import * as PIXI from 'pixi.js'
import { IDemolishable } from '../../interface/IDemolishable'
import { TextDefaults } from '../../utils/Defaults'
import { IDimension } from '../math/Dimension'
import { IVector2, Vector2 } from '../math/Vector2'
import { Animator, IAnimator } from './Animator'
import { scaleFontSize, scaleRescale, TextStyles } from './TextStyles'
import { Tween } from './tween/Tween'
import { IContainer } from '../display/Container'

export enum TextSpriteAlign {
    Left = 'Left',
    Center = 'Center',
    Right = 'Right'
}

export interface ITextSprite extends IDemolishable, IContainer {
    setText(newText: string, animate?: boolean, animationDuration?: number): Promise<void>
}

export interface TextSpriteOptions {
    uppercase?: boolean
    style?: TextSpriteStyle
    anchor?: IVector2 | number
    text?: string
    align?: TextSpriteAlign | string
}

export interface TextSpriteStyle {
    fontFamily?: string
    fontSize?: number
    color?: number
    rescale?: number
    align?: TextSpriteAlign | string
    uppercase?: boolean
}

export class TextSprite extends PIXI.Text implements ITextSprite {
    _textDimensions: IDimension
    uppercase: boolean
    style: PIXI.TextStyle
    rescale: number
    animator: IAnimator

    constructor(options: TextSpriteOptions) {
        const uppercase = (options.uppercase ?? options.style?.uppercase) ?? false
        const text = options.text ? (uppercase ? options.text.toUpperCase() : options.text) : ''
        const fontFamily = (options.style && options.style?.fontFamily) ?? TextDefaults.fontFamily
        const fontSize = (options.style && options.style?.fontSize) ?? scaleFontSize(TextDefaults.fontSize)
        const fill = (options.style && options.style?.color) ?? TextDefaults.color
        const rescale = (options.style && options.style?.rescale) ?? scaleRescale(TextDefaults.rescale)
        const align = options.style?.align ? options.style?.align : (options.align) ?? 'center'
        const wordWrap = false
        const style = new PIXI.TextStyle({ fontFamily, fontSize, fill, align, wordWrap })
        
        super(text, style)
        
        this.style = style
        this.rescale = rescale
        this.uppercase = uppercase
        this._textDimensions = PIXI.TextMetrics.measureText(text, style)
        this.scale.set(rescale, rescale)
        this.animator = new Animator()

        if (options.anchor !== undefined) {
            const anc = typeof options.anchor === 'number'
                ? { x: options.anchor, y: options.anchor } : options.anchor

            this.anchor.set(anc.x, anc.y)
        }
    }

    async setText(newText: string, animate: boolean = false, animationDuration?: number) {
        if (animate) {
            this.animator.currentAnimation = this.getHideAnimation(animationDuration)
            await this.animator.play()
        }

        const text = this.uppercase ? newText?.toUpperCase() : newText
        this.text = text

        if (animate) {
            this.animator.currentAnimation = this.getShowAnimation(animationDuration)
            await this.animator.play()
        }
        
    }
    
    getShowAnimation(animationDuration?: number) {
        return Tween.to(this, {
            alpha: 1,
            duration: animationDuration || 0.25
        })
    }

    getHideAnimation(animationDuration?: number) {
        return Tween.to(this, {
            alpha: 0,
            duration: animationDuration || 0.25
        })
    }
    
    get textWidth() {
        return this._textDimensions.width * this.rescale
    }
    
    get textHeight() {
        return this._textDimensions.height * this.rescale
    }
    
    get scaledTextWidth() {
        return this.textWidth * TextStyles.TextRescaleMultiplier
    }
    
    get scaledTextHeight() {
        return this.textHeight * TextStyles.TextRescaleMultiplier
    }

    get textDimensions() {
        throw new Error('Don\'t get textDimensions directly, doesn\'t have scale applied')
    }

    get halfTextWidth() {
        return this.textWidth / 2
    }

    get halfTextHeight() {
        return this.textHeight / 2
    }

    get pos() {
        return this.position
    }

    set pos(value: IVector2) {
        this.position.set(value.x, value.y)
    }

    demolish(): void {
        this.destroy()
    }

    clearChildren(): void {
        this.demolish()
    }

    addChild<TChildren extends PIXI.DisplayObject[] | IContainer[]>(...children: TChildren): TChildren[0] {
        super.addChild(...children as PIXI.DisplayObject[])
        return children[0]
    }

    removeChild<TChildren extends PIXI.DisplayObject[] | IContainer[]>(...children: TChildren): TChildren[0] {
        super.removeChild(...children as PIXI.DisplayObject[])
        return children[0]
    }
}
