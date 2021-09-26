import { Container, IContainer } from '../../../engine/display/Container'
import { getRandomIntBetween } from '../../../utils/Utils'
import { DecorationDirectory } from '../DecorationDirectory'
import { MapBuildingType } from '../MapBuilding'
import { IMapBuildingFloor } from '../MapBuildingFloor'
import { FloorDecorationItem } from './FloorDecorationItem'

export interface IFloorDecoration extends IContainer {

}

export interface FloorDecorationOptions {
    floor: IMapBuildingFloor
    type: MapBuildingType
}

export class FloorDecoration extends Container implements IFloorDecoration {
    type: MapBuildingType

    constructor(options: FloorDecorationOptions) {
        super()

        this.type = options.type

        this.randomlyGenerateDecor(options)
    }

    randomlyGenerateDecor(options: FloorDecorationOptions) {
        const totalDecor = getRandomIntBetween(3, 10)
        
        const allDecorations = DecorationDirectory.getDecorationsForType(this.type)
        // const allDecorations = DecorationDirectory.allDecorations

        for (var i = 0; i < totalDecor; i++) {
            const randomIndex: number = getRandomIntBetween(0, allDecorations.length)
            const randomID: string = allDecorations[randomIndex]
            
            const item = new FloorDecorationItem({ itemID: randomID })
            item.x = Math.random() * options.floor.width
            item.y = 2

            this.addChild(item)
        }
    }
}
