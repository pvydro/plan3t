import { ITextSprite, TextSprite, TextSpriteOptions } from '../engine/display/TextSprite'

export interface IUIText extends ITextSprite {

}

export interface UITextOptions extends TextSpriteOptions {

}

export class UIText extends TextSprite implements IUIText {
    _isShown: boolean

    constructor(options: UITextOptions) {
        super(options)
    }
    
    update(): void {
        
    }

    forceHide() {
        this.alpha = 0
        this._isShown = false
    }

    async show() {
        this._isShown = true
    }
    
    async hide() {
        this._isShown = false
    }

    get isShown() {
        return this._isShown
    }

    reposition(addListener?: boolean): void {
        
    }
}
