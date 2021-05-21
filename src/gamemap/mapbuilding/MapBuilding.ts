import { GameMapContainer, GameMapContainerBuilderResponse, IGameMapContainer } from '../GameMapContainer'
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

            this.builder.buildBuilding(this.buildingOptions).then((response: GameMapContainerBuilderResponse) => {
                this.tileLayer = response.tileLayer
                this.collisionRects = response.collisionRects

                this.addChild(this.tileLayer)
                
                super.initializeMap()

                resolve()
            })
        })
    }
    
    get groundRect() {
        return this.collisionRects[0]
    }
}
