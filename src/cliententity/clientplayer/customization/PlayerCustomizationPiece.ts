import { Container, IContainer } from '../../../engine/display/Container'

export interface IPlayerCustomizationPiece extends IContainer {

}

export class PlayerCustomizationPiece extends Container implements IPlayerCustomizationPiece {
    constructor() {
        super()
    }
}
