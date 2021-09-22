import { Container, IContainer } from '../../../engine/display/Container'
import { getRandomIntBetween } from '../../../utils/Utils'
import { IMapBuildingFloor } from '../MapBuildingFloor'

export interface IFloorDecoration extends IContainer {

}

export interface FloorDecorationOptions {
    floor: IMapBuildingFloor
}

export class FloorDecoration extends Container implements IFloorDecoration {
    constructor(options: FloorDecorationOptions) {
        super()

        this.randomlyGenerateDecor(options)
    }

    randomlyGenerateDecor(options: FloorDecorationOptions) {
        const totalDecor = getRandomIntBetween(0, 5)

        
    }
}
