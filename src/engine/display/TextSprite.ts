import * as PIXI from 'pixi.js'
import { Fonts } from '../../asset/Fonts'
import { IDemolishable } from '../../interface/IDemolishable'
import { TextDefaults } from '../../utils/Defaults'
import { IDimension } from '../math/Dimension'
import { IVector2, Vector2 } from '../math/Vector2'
import { scaleFontSize, scaleRescale } from './TextStyles'

export enum TextSpriteAlign {
    Left = 'left',
    Center = 'center',
    Right = 'right'
}

export interface ITextSprite extends IDemolishable {

}

export interface TextSpriteOptions {
    text: string
    align?: TextSpriteAlign
    uppercase?: boolean
    style?: TextSpriteStyle
}

export interface TextSpriteStyle {
    fontFamily?: string
    fontSize?: number
    color?: number
    rescale?: number
}

export class TextSprite extends PIXI.Text implements ITextSprite {
    style: PIXI.TextStyle
    _textDimensions: IDimension
    rescale: number

    constructor(options: TextSpriteOptions) {
        const text = options.uppercase === true ? options.text.toUpperCase() : options.text
        const fontFamily = (options.style && options.style.fontFamily) ?? TextDefaults.fontFamily
        const fontSize = (options.style && options.style.fontSize) ?? scaleFontSize(TextDefaults.fontSize)
        const fill = (options.style && options.style.color) ?? TextDefaults.color
        const rescale = (options.style && options.style.rescale) ?? scaleRescale(TextDefaults.rescale)
        const align = (options.align as string) ?? 'center'
        const wordWrap = false
        const style = new PIXI.TextStyle({ fontFamily, fontSize, fill, align, wordWrap })
        
        super(text, style)
        
        this.style = style
        this.rescale = rescale
        this._textDimensions = PIXI.TextMetrics.measureText(text, style)

        this.scale.set(rescale, rescale)        
    }
    
    get textWidth() {
        return this._textDimensions.width * this.rescale
    }
    
    get textHeight() {
        return this._textDimensions.height * this.rescale
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
