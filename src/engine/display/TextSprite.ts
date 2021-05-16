import * as PIXI from 'pixi.js'
import { Fonts } from '../../asset/Fonts'
import { IDemolishable } from '../../interface/IDemolishable'
import { TextDefaults } from '../../utils/Defaults'
import { IDimension } from '../math/Dimension'
import { IVector2, Vector2 } from '../math/Vector2'
import { scaleFontSize, scaleRescale, TextStyles } from './TextStyles'

export enum TextSpriteAlign {
    Left = 'left',
    Center = 'center',
    Right = 'right'
}

export interface ITextSprite extends IDemolishable {

}

export interface TextSpriteOptions {
    uppercase?: boolean
    style?: TextSpriteStyle
    anchor?: IVector2 | number
    text: string
    align?: TextSpriteAlign
}

export interface TextSpriteStyle {
    fontFamily?: string
    fontSize?: number
    color?: number
    rescale?: number
    align?: TextSpriteAlign
    uppercase?: boolean
}

export class TextSprite extends PIXI.Text implements ITextSprite {
    _textDimensions: IDimension
    style: PIXI.TextStyle
    rescale: number

    constructor(options: TextSpriteOptions) {
        const uppercase = (options.uppercase ?? options.style.uppercase) ?? false
        const text = uppercase ? options.text.toUpperCase() : options.text
        const fontFamily = (options.style && options.style.fontFamily) ?? TextDefaults.fontFamily
        const fontSize = (options.style && options.style.fontSize) ?? scaleFontSize(TextDefaults.fontSize)
        const fill = (options.style && options.style.color) ?? TextDefaults.color
        const rescale = (options.style && options.style.rescale) ?? scaleRescale(TextDefaults.rescale)
        const align = options.style.align ? options.style.align : (options.align) ?? 'center'
        const wordWrap = false
        const style = new PIXI.TextStyle({ fontFamily, fontSize, fill, align, wordWrap })
        
        super(text, style)
        
        this.style = style
        this.rescale = rescale
        this._textDimensions = PIXI.TextMetrics.measureText(text, style)
        this.scale.set(rescale, rescale)

        if (options.anchor !== undefined) {
            const anc = typeof options.anchor === 'number'
                ? { x: options.anchor, y: options.anchor } : options.anchor

            this.anchor.set(anc.x, anc.y)
        }
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

    demolish(): void {
        this.destroy()
    }
}
