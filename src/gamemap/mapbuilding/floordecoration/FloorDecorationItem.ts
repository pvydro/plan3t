import { GravityEntity, IGravityEntity } from '../../../cliententity/GravityEntity'

export interface IFloorDecorationItem extends IGravityEntity {

}

export interface FloorDecorationItemOptions {
    itemID: string
}

export class FloorDecorationItem extends GravityEntity implements IFloorDecorationItem {
    constructor(options: FloorDecorationItemOptions) {
        super()
    }
}
