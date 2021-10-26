import { GameMapHelper } from './GameMapHelper'
import { IDemolishable } from '../interface/IDemolishable'
import { logError, log } from '../service/Flogger'
import { Spherical } from './spherical/Spherical'
import { Container } from '../engine/display/Container'
import { GlobalScale } from '../utils/Constants'
import { Rect } from '../engine/math/Rect'
import { IUpdatable } from '../interface/IUpdatable'
import { SphericalData } from './spherical/SphericalData'
import { GameMapContainer } from './GameMapContainer'
import { Homeshipical } from './homeship/Homeshipical'
import { Camera } from '../camera/Camera'
import { CameraStageBackgroundType } from '../camera/CameraStage'
import { MapBuildingType } from './mapbuilding/MapBuilding'
import { MapBuildingHelper } from './mapbuilding/MapBuildingHelper'

export interface IGameMap extends IDemolishable, IUpdatable {
    initializeRandomSpherical(): Promise<void>
    initializeBuilding(type: MapBuildingType): Promise<void>
    transitionToMap(type: MapBuildingType): Promise<void>
    demolish(): void
    collidableRects: Rect[]
}

export class GameMap extends Container implements IGameMap {
    private static Instance?: GameMap
    currentMap?: GameMapContainer
    currentMapBuildingType?: MapBuildingType
    
    static getInstance() {
        if (GameMap.Instance === undefined) {
            GameMap.Instance = new GameMap()
        }

        return GameMap.Instance
    }

    private constructor() {
        super()

        this.scale.set(GlobalScale, GlobalScale)
    }

    update() {
        if (this.currentMap) this.currentMap.update()
    }

    async initializeHomeship(): Promise<void> {
        log('GameMap', 'initializeHomeship')

        const homeship = Homeshipical.getInstance()

        this.camera.stage.setBackground(CameraStageBackgroundType.BlueSky)

        await this.applyGameMapContainer(homeship)
    }

    async initializeBuilding(type: MapBuildingType) {
        this.currentMapBuildingType = type
        
        const building = MapBuildingHelper.getMapBuildingForType(type)
        
        await this.applyGameMapContainer(building)
    }

    // TODO: Seed
    async initializeRandomSpherical() {
        log('GameMap', 'initializeRandomSpherical')

        const randomSphericalData = await GameMapHelper.getRandomSphericalData()

        this.initializePremadeSpherical(randomSphericalData)
    }

    async initializePremadeSpherical(data: SphericalData) {
        log('GameMap', 'initializePremadeSpherical')

        const spherical = new Spherical(data)

        this.camera.stage.setBackground(CameraStageBackgroundType.BlueSky)
        await this.applyGameMapContainer(spherical)
    }

    applyGameMapContainer(mapContainer: GameMapContainer): Promise<void> {
        const shouldTransitionIn = (this.currentMap !== undefined)

        this.clearCurrentMap()

        return new Promise((resolve, reject) => {
            mapContainer.initializeMap().then(() => {
                this.currentMap = mapContainer

                this.addChild(this.currentMap)

                if (shouldTransitionIn) {
                    this.currentMap.transitionIn().then(() => {
                        resolve()
                    })
                } else {
                    resolve()
                }
            }).catch((e) => {
                logError('GameMap', 'Error applying GameMapContainer', 'error', e)

                reject()
            })
        })
    }

    async transitionToMap(type: MapBuildingType) {
        log('GameMap', 'transitionToMap', 'type', type)

        if (this.currentMap) await this.currentMap.transitionOut()
        this.initializeBuilding(type)
    }

    private clearCurrentMap() {
        if (this.currentMap !== undefined) {
            this.currentMap.demolish()
            this.removeChild(this.currentMap)
        }
    }

    demolish() {
        log('GameMap', 'demolish')
    }

    get collidableRects() {
        return (this.currentMap && this.currentMap.collisionRects) ? this.currentMap.collisionRects : []
    }

    get camera() {
        return Camera.getInstance()
    }
}
