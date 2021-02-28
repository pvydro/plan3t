import * as PIXI from 'pixi.js'
import { Fonts } from '../../asset/Fonts'
import { IDemolishable } from '../../interface/IDemolishable'
import { IDimension } from '../math/Dimension'
import { IVector2, Vector2 } from '../math/Vector2'

export enum TextSpriteAlign {
    Left = 'left',
    Center = 'center',
    Right = 'right'
}

export interface ITextSprite extends IDemolishable {

}

export interface TextSpriteOptions {
    text: string
    fontFamily?: string
    fontSize?: number
    color?: number
    align?: TextSpriteAlign
}

export class TextSprite extends PIXI.Text implements ITextSprite {
    style: PIXI.TextStyle
    _textDimensions: IDimension

    constructor(options: TextSpriteOptions) {
        const fontFamily = options.fontFamily ?? Fonts.Font.family
        const fontSize = options.fontSize ?? 16
        const fill = options.color ?? 0xFFFFFF
        const align = (options.align as string) ?? 'center'
        const wordWrap = false

        const style = new PIXI.TextStyle({ fontFamily, fontSize, fill, align, wordWrap })
        
        super(options.text, style)
        
        this.style = style
        this._textDimensions = PIXI.TextMetrics.measureText(options.text, style)

        this.scale.set(0.5, 0.5)        
    }
    
    get textWidth() {
        return this._textDimensions.width * 0.5
    }
    
    get textHeight() {
        return this._textDimensions.height * 0.5
    }

    get textDimensions() {
        throw new Error('Dont get textDimensions directly, doesnt have scale applied')
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
