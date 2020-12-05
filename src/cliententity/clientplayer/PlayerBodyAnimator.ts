import * as PIXI from 'pixi.js'
import { Spritesheets, SpritesheetUrls } from '../../asset/Spritesheets'
import { IUpdatable } from '../../interface/IUpdatable'
import { IClientPlayer, PlayerBodyState } from './ClientPlayer'
import { IPlayerBody } from './PlayerBody'

export interface IPlayerBodyAnimator extends IUpdatable {
    runningSprite: PIXI.AnimatedSprite
}

export interface PlayerBodyAnimatorOptions {
    player: IClientPlayer
    playerBody: IPlayerBody
}

export class PlayerBodyAnimator implements IPlayerBodyAnimator {
    playerBody: IPlayerBody
    player: IClientPlayer

    runningSprite: PIXI.AnimatedSprite

    constructor(options: PlayerBodyAnimatorOptions) {
        this.playerBody = options.playerBody
        this.player = options.player

        this.buildAnimatedSprites()
    }

    update() {
        const state = this.player.bodyState

        switch (state) {
            case PlayerBodyState.Idle:
                this.playerBody.showIdleSprite()
                break
            case PlayerBodyState.Walking:
                this.playerBody.showRunningSprite()
                break
        }
    }

    buildAnimatedSprites() {
        const walkingSheetUrl = SpritesheetUrls.PLAYER_BODY_WALKING
        const sheet = Spritesheets.get(walkingSheetUrl)

        this.runningSprite = new PIXI.AnimatedSprite(sheet.animations['tile'])
        this.runningSprite.animationSpeed = 0.25
        this.runningSprite.anchor.set(0.5, 0.5)
    }
}
