import { Container } from 'pixi.js'
import { GameMapContainerBuilderResponse } from '../GameMapContainer'

export interface IBuildingBuilder {
    buildBuilding(): Promise<GameMapContainerBuilderResponse>
}

export class BuildingBuilder implements IBuildingBuilder {
    constructor() {

    }

    async buildBuilding(): Promise<GameMapContainerBuilderResponse> {
        const tileLayer = new Container()
        // const backgroundTexture = 

        return {
            tileLayer: undefined,
            collisionRects: []
        }
    }
}
