import { GradientOutline } from '../../engine/display/lighting/GradientOutline'
import { Rect } from '../../engine/math/Rect'
import { log } from '../../service/Flogger'
import { GameMapContainer, IGameMapContainer } from '../GameMapContainer'
import { IMapBuildingAnimator, MapBuildingAnimator } from './MapBuildingAnimator'
import { MapBuildingBackground } from './MapBuildingBackground'
import { MapBuildingFloor } from './MapBuildingFloor'
import { MapBuildingWalls as MapBuildingWalls } from './MapBuildingWalls'

export enum MapBuildingType {
    Dojo = 'dojo',
    Castle = 'castle',
    // ModernHome = 'modernhome',
    // Warehouse = 'warehouse'
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
    walls: MapBuildingWalls
    floor: MapBuildingFloor
    background: MapBuildingBackground
    animator!: IMapBuildingAnimator
    type: MapBuildingType
    outline: GradientOutline

    constructor(options: MapBuildingOptions) {
        super()
        
        this.buildingOptions = options
        this.type = options.type
    }

    initializeMap(): Promise<void> {
        this.clearChildren()

        return new Promise((resolve) => {
            this.walls = new MapBuildingWalls({ type: this.type })
            this.floor = new MapBuildingFloor({ type: this.type })
            this.background = new MapBuildingBackground({ type: this.type })
            this.animator = new MapBuildingAnimator({
                floor: this.floor,
                backgroundSprite: this.walls
            })
            
            this.addChild(this.background)
            this.addChild(this.walls)
            this.addChild(this.floor)
            
            this.reposition()            
            this.collisionRects = this.buildCollisionRects()
            
            super.initializeMap()

            resolve()
        })
    }

    reposition() {
        this.walls.x = 0
        this.floor.x = 0
        this.floor.y = this.walls.height - 56
    }

    buildCollisionRects(): Rect[] {
        const groundRect = new Rect({
            x: 0, y: this.floor.y + 2,
            width: this.floor.width,
            height: 42
        })

        return [ groundRect ]
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
