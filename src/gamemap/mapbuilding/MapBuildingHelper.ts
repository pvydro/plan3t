import { Assets } from '../../asset/Assets'
import { MapBuilding, MapBuildingType } from './MapBuilding'

export class MapBuildingHelper {
    private constructor() {
        
    }

    static getMapBuildingForType(type: MapBuildingType): MapBuilding {
        return new MapBuilding({ type })
    }

    static getBackgroundUrlForType(type: MapBuildingType): PIXI.Texture {
        const url = Assets.BaseImageDir + '/gamemap/mapbuilding/' + type + '/background'

        return PIXI.Texture.from(Assets.get(url))
    }

    static getFloorAssetForType(type: MapBuildingType): PIXI.Texture {
        const url = Assets.BaseImageDir + '/gamemap/mapbuilding/' + type + '/platform'
        
        return PIXI.Texture.from(Assets.get(url))
    }
}
