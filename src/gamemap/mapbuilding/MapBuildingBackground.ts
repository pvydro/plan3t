import { Container, IContainer } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { log } from '../../service/Flogger'
import { MapBuildingType } from './MapBuilding'
import { MapBuildingHelper } from './MapBuildingHelper'

export interface IMapBuildingBackground extends IContainer {

}

export interface MapBuildingBackgroundOptions {
    type: MapBuildingType
}


export class MapBuildingBackground extends Container implements IMapBuildingBackground {
    type: MapBuildingType
    backgroundSprite: Sprite

    constructor(options: MapBuildingBackgroundOptions) {
        super()

        this.type = options.type

        this.addChild(this.createBackground())
    }

    createBackground() {
        log('MapBuildingBackground', 'createBackground')

        const texture = MapBuildingHelper.getBackgroundAssetForType(this.type)
        
        this.backgroundSprite = new Sprite({ texture })
        this.backgroundSprite.anchor.x = 0.5

        return this.backgroundSprite
    }
}
