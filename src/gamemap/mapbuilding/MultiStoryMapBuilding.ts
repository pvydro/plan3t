import { MapBuildingType } from '../../network/utils/Enum'
import { GameMapContainer } from '../GameMapContainer'
import { MapBuilding } from './MapBuilding'

export interface IMultiStoryMapBuilding {
}

export interface MultiStoryMapBuildingOptions {
    totalStories: number
    type: MapBuildingType

    // storyHeight: number ?
    // storyHeightVariance: number ?
}

export class MultiStoryMapBuilding extends GameMapContainer implements IMultiStoryMapBuilding {
    totalStories: number
    stories: Map<number, MapBuilding> = new Map()
    type: MapBuildingType

    constructor(options: MultiStoryMapBuildingOptions) {
        super()

        this.totalStories = options.totalStories
        this.type = options.type
    }

    async initializeMap() {
        for (let i = 0; i < this.totalStories; i++) {
            const floor = new MapBuilding({
                type: this.type
            })

            if (i > 0) {
                const lastFloorY = this.stories.get(i - 1).y

                floor.y = lastFloorY - floor.height
            }

            this.addChild(floor)

            this.stories.set(i, floor)
        }

        super.initializeMap()
    }

    update() {

    }
}
