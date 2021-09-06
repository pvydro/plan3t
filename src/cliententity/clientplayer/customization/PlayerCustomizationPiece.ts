import { Container, IContainer } from '../../../engine/display/Container'
import { IUpdatable } from '../../../interface/IUpdatable'

export interface IPlayerCustomizationPiece extends IContainer, IUpdatable {
    flipX(): void
}

export class PlayerCustomizationPiece extends Container implements IPlayerCustomizationPiece {
    constructor() {
        super()
    }

    update() {
        
    }

    flipX() {
        this.scale.x *= -1
    }
}
