import * as PIXI from 'pixi.js'
import { Spritesheets, SpritesheetUrls } from '../../asset/Spritesheets'
import { AnimatedSprite } from '../../display/AnimatedSprite'
import { IContainer, Container } from '../../display/Container'
import { IClientPlayer } from './ClientPlayer'

export interface IPlayerBody extends IContainer {

}

export interface PlayerBodyOptions {
    player: IClientPlayer
}

export class PlayerBody extends Container {
    bodySprite: AnimatedSprite

    constructor(options: PlayerBodyOptions) {
        super()

        // this.bodySprite = new AnimatedSprite({
        //     spritesheet: Spritesheets.get(SpritesheetUrls.PLAYER_BODY_WALKING)
        // })
        const res = SpritesheetUrls.PLAYER_BODY_WALKING
        console.log('res: ' + res)

        const sheet = PIXI.Loader.shared.resources['assets/image/player/body/body_walking.json'].spritesheet
        this.bodySprite = new PIXI.AnimatedSprite(sheet.animations['tile'])
        this.bodySprite.animationSpeed = 0.25
        this.bodySprite.anchor.set(0.5, 0.5)

        this.bodySprite.play()

        this.addChild(this.bodySprite)
    }
}
