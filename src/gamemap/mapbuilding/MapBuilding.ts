import { GameMapContainer, IGameMapContainer } from '../GameMapContainer'

export interface IMapBuilding extends IGameMapContainer {

}

export class MapBuilding extends GameMapContainer implements IMapBuilding {
    constructor() {
        super()
    }

    initializeMap(): Promise<void> {
        return new Promise((resolve) => {

            super.initializeMap()

            resolve()
        })
    }
}
