import { AnimatedSprite, AnimationOptions } from '../engine/display/AnimatedSprite'
import { Container, IContainer } from '../engine/display/Container'
import { ISprite, Sprite } from '../engine/display/Sprite'
import { Spritesheet } from '../engine/display/spritesheet/Spritesheet'
import { loudLog } from '../service/Flogger'
import { trimArray } from '../utils/Utils'

export interface ICreatureSpriteStore extends IContainer {
    idleSprite: Sprite | AnimatedSprite
    dyingSprite: Sprite | AnimatedSprite
    walkingSprite: Sprite | AnimatedSprite
    walkingSpriteAnimated: AnimatedSprite | undefined
    dyingSpriteAnimated: AnimatedSprite | undefined
    showSprite(value: AnimatedSprite | Sprite): void
}

export interface CreatureSpriteDefinition {
    sprite: Sprite | Spritesheet
    animationOptions?: AnimationOptions
}

export interface CreatureSprites {
    idleSpriteDef?: CreatureSpriteDefinition
    walkingSpriteDef?: CreatureSpriteDefinition
    dyingSpriteDef?: CreatureSpriteDefinition
}

export class CreatureSpriteStore extends Container implements ICreatureSpriteStore {
    _currentlyShown: any = undefined
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
        const idleSprite = sprites.idleSpriteDef ? this.convertToSpriteOrAnimatedSprite(sprites.idleSpriteDef) : undefined
        const walkingSprite = sprites.walkingSpriteDef ? this.convertToSpriteOrAnimatedSprite(sprites.walkingSpriteDef) : undefined
        const dyingSprite = sprites.dyingSpriteDef ? this.convertToSpriteOrAnimatedSprite(sprites.dyingSpriteDef) : undefined
        
        if (idleSprite)     idleSprite.anchor.x = 0.5
        if (walkingSprite)  walkingSprite.anchor.x = 0.5
        if (dyingSprite)    dyingSprite.anchor.x = 0.5

        this._idleSprite = idleSprite ?? this._idleSprite
        this._walkingSprite = walkingSprite ?? this._walkingSprite
        this._dyingSprite = dyingSprite ?? this._dyingSprite
        
        if (this._idleSprite)     this.addChild(this._idleSprite)
        if (this._walkingSprite)  this.addChild(this._walkingSprite)
        if (this._dyingSprite)    this.addChild(this._dyingSprite)

        this._allSprites = trimArray(
            this._idleSprite,
            this._walkingSprite,
            this._dyingSprite
        )

        this.hideAllExcept(this.idleSprite)
    }

    showSprite(value: AnimatedSprite | Sprite) {
        if (this._currentlyShown === value) return

        this.hideAllExcept(value)
        this._currentlyShown = value

        if (this.isAnimatedSprite(value)) {
            const animatedSpriteValue = value as AnimatedSprite
            
            if (animatedSpriteValue) {
                animatedSpriteValue.play()
            }
        }
    }

    hideAllSprites() {
        for (var i in this._allSprites) {
            const spr = this._allSprites[i]

            spr.alpha = 0
        }
    }

    convertToSpriteOrAnimatedSprite(spriteDefinition: CreatureSpriteDefinition): Sprite | AnimatedSprite {
        const spr = spriteDefinition.sprite
        const animationSpeed = (spriteDefinition.animationOptions && spriteDefinition.animationOptions.animationSpeed) ?? 0.25
        const loop = (spriteDefinition.animationOptions && spriteDefinition.animationOptions.loop) ?? false
        let convertedSprite: any = !spr ? undefined : (spr as Sprite)

        if (spr instanceof Spritesheet) {
            convertedSprite = new AnimatedSprite({
                sheet: (spr as Spritesheet).animation,
                animationSpeed, loop
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
