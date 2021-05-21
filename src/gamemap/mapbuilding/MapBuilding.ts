import { GameMapContainer, IGameMapContainer } from '../GameMapContainer'
import { BuildingBuilder, IBuildingBuilder } from './BuildingBuilder'

export enum MapBuildingType {
    Dojo = 'dojo',
    Castle = 'castle',
    ModernHome = 'modernhome',
    Warehouse = 'warehouse'
}

export interface IMapBuilding extends IGameMapContainer {

}

export interface MapBuildingOptions {
    type: MapBuildingType
    isInfinite?: boolean
}

export class MapBuilding extends GameMapContainer implements IMapBuilding {
    buildingOptions: MapBuildingOptions
    builder: IBuildingBuilder

    constructor(options: MapBuildingOptions) {
        super()
        
        this.buildingOptions = options
        this.builder = new BuildingBuilder()
    }

    initializeMap(): Promise<void> {
        return new Promise((resolve) => {

            super.initializeMap()

            resolve()
        })
    }
}
