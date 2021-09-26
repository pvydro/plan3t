import { Container, IContainer } from '../../../engine/display/Container'
import { getRandomIntBetween } from '../../../utils/Utils'
import { DecorationDirectory } from '../DecorationDirectory'
import { MapBuildingType } from '../MapBuilding'
import { IMapBuildingFloor } from '../MapBuildingFloor'
import { FloorDecorationItem } from './DecorationItem'

export interface IDecoration extends IContainer {

}

export interface DecorationOptions {
    floor: IMapBuildingFloor
    type: MapBuildingType
}

export class Decoration extends Container implements IDecoration {
    type: MapBuildingType

    constructor(options: DecorationOptions) {
        super()

        this.type = options.type

        this.randomlyGenerateDecor(options)
    }

    randomlyGenerateDecor(options: DecorationOptions) {
        const totalDecor = getRandomIntBetween(3, 10)
        
        const allDecorations = DecorationDirectory.getDecorationsForType(this.type)

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
