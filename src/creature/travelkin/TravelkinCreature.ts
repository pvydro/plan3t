import { GroundPatherAI, IGroundPatherAI } from '../../ai/groundpather/GroundPatherAI'
import { GravityOrganismState } from '../../cliententity/gravityorganism/GravityOrganism'
import { AnimatedSprite } from '../../engine/display/AnimatedSprite'
import { Container } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { Spritesheet } from '../../engine/display/spritesheet/Spritesheet'
import { trimArray } from '../../utils/Utils'
import { Bullet } from '../../weapon/projectile/Bullet'
import { ICreature, Creature, CreatureOptions } from '../Creature'
import { CreatureSpriteStore } from '../CreatureSpriteStore'
import { ITravelkinAnimator, TravelkinAnimator } from './TravelkinAnimator'
import { ITravelkinMovementController, TravelkinMovementController } from './TravelkinMovementController'

export enum TravelkinMovementState {
    NotSet,
    Idle,
    Walking,
    Dead
}

export interface ITravelkinCreature extends ICreature {
    ai: IGroundPatherAI
    movementState: TravelkinMovementState
    walkSpeed: number
    isDead: boolean
    showIdleSprite(): void
    showWalkingSprite(): void
}

export interface TravelkinCreatureOptions extends CreatureOptions {
    walkSpeed?: number
    walkingSheet?: Spritesheet
}

export class TravelkinCreature extends Creature implements ITravelkinCreature {
    _movementState: TravelkinMovementState = TravelkinMovementState.NotSet
    // walkingSprite: AnimatedSprite
    animator: ITravelkinAnimator
    walkSpeed: number
    ai: IGroundPatherAI
    movementController: ITravelkinMovementController
    currentShown?: AnimatedSprite | Sprite | Container

    constructor(options: TravelkinCreatureOptions) {
        super(options)

        const travelkin = this

        this.spriteStore = new CreatureSpriteStore({
            idleSprite: options.idleSprite,
            walkingSprite: options.walkingSheet,
            dyingSprite: options.dyingSheet
        })
        this.walkSpeed = options.walkSpeed ?? 5
        this.ai = new GroundPatherAI({ gravityOrganism: travelkin })
        this.animator = new TravelkinAnimator({
            travelkin, // TODO This one below 
            // walkingSprite: this.spriteStore.walkingSprite ?? undefined//options.walkingSheet ?? undefined
        })
        this.movementController = new TravelkinMovementController({ travelkin })

        this.addChild(this.spriteStore)
        // Add walkingsprite if walkingsheet was passed through
        // if (options.walkingSheet) {
        //     this.walkingSprite = this.animator.walkingSprite
        //     this.addChild(this.walkingSprite)
        // }
    }

    update() {
        this.ai.update()
        this.movementController.update()
        
        super.update()
    }

    showIdleSprite() {
        this.spriteStore.showSprite(this.idleSprite)
        // if (this.currentShown !== this.sprite) {
        //     this.currentShown = this.sprite
        // }

        // this.hideAllExcept(this.sprite)
    }

    showWalkingSprite() {
        this.spriteStore.showSprite(this.walkingSprite)
        // if (this.walkingSprite) {
        //     if (this.currentShown !== this.walkingSprite) {
        //         if (this.walkingSpriteAnimated) this.walkingSpriteAnimated.gotoAndPlay(0)

        //         this.currentShown = this.walkingSprite
        //     }
    
        //     // this.hideAllExcept(this.walkingSprite)
        //     this.spriteStore.showSprite(this.walkingSprite)

        //     if (this.walkingSpriteAnimated) {
        //         this.walkingSpriteAnimated.play()
        //     }
        // }
    }

    getAllSprites() {
        return trimArray(this.idleSprite, this.walkingSprite, this.dyingSprite)
    }

    // hideAllExcept(shownSprite: any) {
    //     const hideable = this.getAllSprites()

    //     for (var i in hideable) {
    //         const hideElement = hideable[i]

    //         if (hideElement !== undefined && hideElement !== shownSprite) {
    //             hideElement.alpha = 0
    //         }
    //     }

    //     if (shownSprite === undefined) {
    //         shownSprite = this.idleSprite
    //         shownSprite.alpha = 1
    //     } else {
    //         shownSprite.alpha = 1
    //     }
    // }

    flipAllSprites() {
        if (this.sprite) this.sprite.flipX()
        if (this.walkingSprite) this.walkingSprite.flipX()
        if (this.dyingSprite) this.dyingSprite.flipX()
    }

    takeDamage(damage: number | Bullet) {
        this.ai.decideIfContinueOrStop()

        super.takeDamage(damage)
    }

    async die() {
        if (this.movementState === TravelkinMovementState.Dead) return

        this.movementState = TravelkinMovementState.Dead
        this.ai.stop()

        await super.die()
    }

    get movementState() {
        return this._movementState
    }

    set movementState(value: TravelkinMovementState) {
        if (this._movementState !== value) {
            this._movementState = value
            this.animator.updateAnimationState()
        }
    }
}
