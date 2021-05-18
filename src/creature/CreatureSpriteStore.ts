import { AnimatedSprite } from '../engine/display/AnimatedSprite'
import { Container, IContainer } from '../engine/display/Container'
import { ISprite, Sprite } from '../engine/display/Sprite'
import { Spritesheet } from '../engine/display/spritesheet/Spritesheet'
import { loudLog } from '../service/Flogger'

export interface ICreatureSpriteStore extends IContainer {
    idleSprite: Sprite | AnimatedSprite
    dyingSprite: Sprite | AnimatedSprite
    walkingSprite: Sprite | AnimatedSprite
    walkingSpriteAnimated: AnimatedSprite | undefined
    dyingSpriteAnimated: AnimatedSprite | undefined
    showSprite(value: AnimatedSprite | Sprite): void
}

export interface CreatureSprites {
    idleSprite?: Sprite | Spritesheet
    walkingSprite?: Sprite | Spritesheet
    dyingSprite?: Sprite | Spritesheet
}

export class CreatureSpriteStore extends Container implements ICreatureSpriteStore {
    _idleSprite?: Sprite | AnimatedSprite
    _walkingSprite?: Sprite | AnimatedSprite
    _dyingSprite?: Sprite | AnimatedSprite
    _allSprites: ISprite[] = [
        this._idleSprite,
        this._walkingSprite,
        this._dyingSprite
    ]
    
    constructor(sprites?: CreatureSprites) {
        super()

        if (sprites) {
            this.setSprites(sprites)
        }
    }
    
    setSprites(sprites: CreatureSprites) {
        // const spriteVals = Object.values(sprites)
        const idleSprite = this.convertToSpriteOrAnimatedSprite(sprites.idleSprite)
        const walkingSprite = this.convertToSpriteOrAnimatedSprite(sprites.walkingSprite)
        const dyingSprite = this.convertToSpriteOrAnimatedSprite(sprites.dyingSprite)
        
        if (idleSprite)     idleSprite.anchor.x = 0.5
        if (walkingSprite)  walkingSprite.anchor.x = 0.5
        if (dyingSprite)    dyingSprite.anchor.x = 0.5

        this._idleSprite = idleSprite ?? this._idleSprite
        this._walkingSprite = walkingSprite ?? this._walkingSprite
        this._dyingSprite = dyingSprite ?? this._dyingSprite
        
        if (this._idleSprite)     this.addChild(this._idleSprite)
        if (this._walkingSprite)  this.addChild(this._walkingSprite)
        if (this._dyingSprite)    this.addChild(this._dyingSprite)

        this.hideAllExcept(this.idleSprite)
    }

    showSprite(value: AnimatedSprite | Sprite) {
        this.hideAllExcept(value)

        if (this.isAnimatedSprite(value)) {
            loudLog('Is Animated sprite!');

            this.walkingSpriteAnimated.play()
        }
        // this.hideAllSprites()

        // if (value) {
        //     value.alpha = 1
        // }
    }

    hideAllSprites() {
        for (var i in this._allSprites) {
            const spr = this._allSprites[i]

            spr.alpha = 0
        }
    }

    convertToSpriteOrAnimatedSprite(spr: Sprite | Spritesheet): Sprite | AnimatedSprite {
        let convertedSprite: any = !spr ? undefined : (spr as Sprite)

        if (spr instanceof Spritesheet) {
            convertedSprite = new AnimatedSprite({
                sheet: (spr as Spritesheet).animation,
                animationSpeed: 0.25
            })
        }

        return convertedSprite
    }

    isAnimatedSprite(value: Sprite | AnimatedSprite) {
        if (!value) {
            return false
        } else if (value instanceof AnimatedSprite) {
            return true
        } else {
            return false
        }
    }

    private hideAllExcept(shownSprite: any) {
        const hideable = this.allSprites

        for (const i in hideable) {
            const hideElement = hideable[i]

            if (hideElement !== undefined && hideElement !== shownSprite) {
                hideElement.alpha = 0
            }
        }

        if (shownSprite === undefined) {
            shownSprite = this.idleSprite
            shownSprite.alpha = 1
        } else {
            shownSprite.alpha = 1
        }
    }

    flipAllSprites() {
        for (var i in this._allSprites) {
            const spr = this._allSprites[i]

            if (spr !== undefined && typeof spr.flipX === 'function') {
                spr.flipX()
            }
        }
    }

    get allSprites() {
        return this._allSprites
    }
    
    set dyingSprite(value: Sprite | AnimatedSprite) {
        this._dyingSprite = value
    }

    set walkingSprite(value: Sprite | AnimatedSprite) {
        this._walkingSprite = value
    }

    get idleSprite() {
        return this._idleSprite
    }

    get dyingSprite() {
        return this._dyingSprite
    }

    get walkingSprite() {
        return this._walkingSprite
    }
    
    get walkingSpriteAnimated() {
        return (this.walkingSprite && this.isAnimatedSprite(this.walkingSprite))
            ? this.walkingSprite as AnimatedSprite : undefined
    }

    get dyingSpriteAnimated() {
        return this.isAnimatedSprite(this.dyingSprite)
            ? this.dyingSprite as AnimatedSprite : undefined
    }
}
