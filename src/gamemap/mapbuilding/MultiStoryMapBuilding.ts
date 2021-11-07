import { MapBuildingType } from '../../network/utils/Enum'
import { GameMapContainer } from '../GameMapContainer'
import { MapBuilding } from './MapBuilding'

export interface IMultiStoryMapBuilding {
}

export interface MultiStoryMapBuildingOptions {
    stories: number
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

        this.totalStories = options.stories ?? 2
        this.type = options.type
    }

    async initializeMap() {
        this.clearChildren()
        this.collisionRects = []

        for (let i = 0; i < this.totalStories; i++) {
            const floor = new MapBuilding({
                type: this.type
            })
            await floor.initializeMap()
            this.collisionRects.push(...floor.collisionRects)

            if (i >= 1) {
                const lastFloorY = this.stories.get(i - 1).y

                floor.x = 0
                floor.y = lastFloorY - (floor.height / 2)
            }

            this.addChild(floor)

            this.stories.set(i, floor)
        }

        super.initializeMap()
    }

    update() {

    }
}
