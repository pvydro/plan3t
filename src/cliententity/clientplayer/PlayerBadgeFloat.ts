import { Container, IContainer } from '../../engine/display/Container'
import { Graphix } from '../../engine/display/Graphix'
import { TextSprite } from '../../engine/display/TextSprite'
import { TextStyles } from '../../engine/display/TextStyles'
import { IVector2 } from '../../engine/math/Vector2'
import { IClientPlayer } from './ClientPlayer'

export interface IPlayerBadgeFloat extends IContainer {

}

export interface PlayerBadgeFloatOptions {
    player: IClientPlayer
}

export class PlayerBadgeFloat extends Container implements IPlayerBadgeFloat {
    textSprite: TextSprite
    background: Graphix

    constructor(options: PlayerBadgeFloatOptions) {
        super()

        this.textSprite = new TextSprite({
            text: options.player.playerName || 'Player',
            style: TextStyles.PlayerBadge
        })
        
        this.addChild(this.textSprite)
        this.createBackground()

        this.position.x = options.player.x - this.halfWidth
        this.position.y = options.player.y + 15
    }

    createBackground() {
        const padding: IVector2 = { x: 2, y: 0.25 }

        this.background = new Graphix()

        this.background.beginFill(0x000000)
        this.background.drawRect(-padding.x, -padding.y,
            this.width + (padding.x * 2),
            this.height + (padding.y * 2))
        this.background.endFill()
        this.background.alpha = 0.25

        this.addChildAt(this.background, 0)
    }
}
