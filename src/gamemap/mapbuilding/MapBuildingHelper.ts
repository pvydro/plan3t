import { Assets } from '../../asset/Assets'
import { MapBuilding, MapBuildingType } from './MapBuilding'
import { logError } from '../../service/Flogger'

const MapBuildings = require('../../json/MapBuildings.json')

export interface MapBuildingProperties {
    totalBackgroundTiles: number
}

export class MapBuildingHelper {
    private constructor() {
        
    }

    static getMapBuildingForType(type: MapBuildingType): MapBuilding {
        return new MapBuilding({ type })
    }

    static getBackgroundAssetForType(type: MapBuildingType): PIXI.Texture {
        const url = Assets.BaseImageDir + '/gamemap/mapbuilding/' + type + '/background'

        return PIXI.Texture.from(Assets.get(url))
    }

    static getFloorAssetForType(type: MapBuildingType): PIXI.Texture {
        const url = Assets.BaseImageDir + '/gamemap/mapbuilding/' + type + '/platform'
        
        return PIXI.Texture.from(Assets.get(url))
    }

    static getTotalBackgroundTilesForType(type: MapBuildingType | string): number {
        try {
            const buildingData: MapBuildingProperties = MapBuildings[type]

            if (buildingData) {
                return buildingData.totalBackgroundTiles
            } else {
                return 0
            }
        } catch (error) {
            logError('Failed to get number of background tiles for type', 'type', type, 'error', error)
            return 0
        }
    }

    static getMapBuildingProperties() {
        return MapBuildings
    }

    static getAllMapTypesInProperties() {
        return [ 'dojo', 'castle' ]
    }
}
