import { Container, IContainer } from '../../engine/display/Container'
import { TextSprite } from '../../engine/display/TextSprite'
import { TextStyles } from '../../engine/display/TextStyles'
import { IClientPlayer } from './ClientPlayer'

export interface IPlayerBadgeFloat extends IContainer {

}

export interface PlayerBadgeFloatOptions {
    player: IClientPlayer
}

export class PlayerBadgeFloat extends Container implements IPlayerBadgeFloat {
    textSprite: TextSprite

    constructor(options: PlayerBadgeFloatOptions) {
        super()

        this.textSprite = new TextSprite({
            text: options.player.playerName,
            style: TextStyles.PlayerBadge
        })

        this.addChild(this.textSprite)

        this.position.x = options.player.x - this.halfWidth
        this.position.y = options.player.y + 15
    }
}
