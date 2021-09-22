import { Container, IContainer } from '../../../engine/display/Container'
import { getRandomIntBetween } from '../../../utils/Utils'
import { IMapBuildingFloor } from '../MapBuildingFloor'
import { FloorDecorationItem } from './FloorDecorationItem'

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
        const baseUrl = 'assets/image/gamemap/mapbuilding/dojo/decorations/'
        const totalDecor = getRandomIntBetween(3, 10)
        
        for (var i = 0; i < totalDecor; i++) {
            const oneOrTwo: boolean = Math.random() > 0.5
            const itemID: string = oneOrTwo ? `${baseUrl}solid_0` : `${baseUrl}solid_1`
            const item = new FloorDecorationItem({ itemID })

            item.x = Math.random() * options.floor.width
            item.y = 2

            this.addChild(item)
        }
    }
}
