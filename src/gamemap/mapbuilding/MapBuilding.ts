import { GradientOutline } from '../../engine/display/lighting/GradientOutline'
import { log } from '../../service/Flogger'
import { GameMapContainer, GameMapContainerBuilderResponse, IGameMapContainer } from '../GameMapContainer'
import { BuildingBuilder, BuildingBuilderResponse, IBuildingBuilder } from './BuildingBuilder'
import { IMapBuildingAnimator, MapBuildingAnimator } from './MapBuildingAnimator'

export enum MapBuildingType {
    Dojo = 'dojo',
    Castle = 'castle',
    ModernHome = 'modernhome',
    Warehouse = 'warehouse'
}

export interface IMapBuilding extends IGameMapContainer {
    type: MapBuildingType
}

export interface MapBuildingOptions {
    type: MapBuildingType
    isInfinite?: boolean
}

export class MapBuilding extends GameMapContainer implements IMapBuilding {
    buildingOptions: MapBuildingOptions
    builder: IBuildingBuilder
    animator!: IMapBuildingAnimator
    type: MapBuildingType
    outline: GradientOutline

    constructor(options: MapBuildingOptions) {
        super()
        
        this.buildingOptions = options
        this.type = options.type
        this.builder = new BuildingBuilder()
    }

    initializeMap(): Promise<void> {
        return new Promise((resolve) => {
            this.builder.buildBuilding(this.buildingOptions).then((response: BuildingBuilderResponse) => {
                this.tileLayer = response.tileLayer
                this.collisionRects = response.collisionRects
                this.animator = new MapBuildingAnimator({
                    floorSprite: response.floorSprite,
                    backgroundSprite: response.backgroundSprite
                })
                this.outline = new GradientOutline({
                    // targetElement: this.tileLayer,
                    targetDimension: { width: 256, height: 128 },
                    gradientWidth: 32,
                    offsetWidth: 12,
                    rayAlpha: 0.25
                })
                
                this.addChild(this.tileLayer)
                this.addChild(this.outline)
                
                super.initializeMap()

                resolve()
            })
        })
    }

    async transitionIn() {
        log('MapBuilding', 'transitionIn', 'type', this.type)

        await super.transitionIn(this.animator.getTransitionOutElements())
    }
    
    async transitionOut() {
        log('MapBuilding', 'transitionOut', 'type', this.type)

        await super.transitionOut(this.animator.getTransitionOutElements())
    }
    
    get groundRect() {
        return this.collisionRects[0]
    }
}
