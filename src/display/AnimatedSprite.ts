import * as PIXI from 'pixi.js'

export interface IAnimatedSprite {

}

export interface AnimatedSpriteOptions {
    spritesheet: any
}

export class AnimatedSprite extends PIXI.AnimatedSprite {
    constructor(options: AnimatedSpriteOptions) {
        super(options.spritesheet)
    }
}
