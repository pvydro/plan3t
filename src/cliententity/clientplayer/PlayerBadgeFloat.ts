import { Container, IContainer } from '../../engine/display/Container'

export interface IPlayerBadgeFloat extends IContainer {

}

export class PlayerBadgeFloat extends Container implements IPlayerBadgeFloat {
    constructor(playerName: string) {
        super()
    }
}
