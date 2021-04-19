import { GameMapHelper } from './GameMapHelper'
import { IDemolishable } from '../interface/IDemolishable'
import { Flogger, log } from '../service/Flogger'
import { Spherical } from './spherical/Spherical'
import { Container } from '../engine/display/Container'
import { GlobalScale } from '../utils/Constants'
import { Rect } from '../engine/math/Rect'
import { GameMapSky } from './GameMapSky'
import { IUpdatable } from '../interface/IUpdatable'
import { SphericalData } from './spherical/SphericalData'
import { GameMapContainer } from './GameMapContainer'
import { Homeshipical } from './homeship/Homeshipical'
import { Camera } from '../camera/Camera'
import { CameraLayer } from '../camera/CameraStage'

export interface IGameMap extends IDemolishable, IUpdatable {
    initializeRandomSpherical(): Promise<void>
    demolish(): void
    collidableRects: Rect[]
}

export class GameMap extends Container implements IGameMap {
    private static INSTANCE?: GameMap
    currentMap?: GameMapContainer
    sky: GameMapSky
    
    static getInstance() {
        if (GameMap.INSTANCE === undefined) {
            GameMap.INSTANCE = new GameMap()
        }

        return GameMap.INSTANCE
    }

    private constructor() {
        super()

        this.scale.set(GlobalScale, GlobalScale)

        this.sky = new GameMapSky()
        // this.addChild(this.sky)
    }

    update() {
        if (this.sky) this.sky.update()
        if (this.currentMap) this.currentMap.update()
    }

    async initializeHomeship(): Promise<void> {
        log('GameMap', 'initializeHomeship')

        const homeship = Homeshipical.getInstance()

        await this.sky.configure({ allBlack: true })
        await this.applyGameMapContainer(homeship)

        this.camera.stage.addChildAtLayer(this.sky, CameraLayer.GameMapSky)
    }

    // TODO: Seed
    async initializeRandomSpherical(): Promise<void> {
        log('GameMap', 'initializeRandomSpherical')

        const randomSphericalData = await GameMapHelper.getRandomSphericalData()

        this.initializePremadeSpherical(randomSphericalData)
    }

    async initializePremadeSpherical(data: SphericalData) {
        log('GameMap', 'initializePremadeSpherical')

        const spherical = new Spherical(data)

        await this.applyGameMapContainer(spherical)
        await this.sky.configure()

        this.camera.stage.addChildAtLayer(this.sky, CameraLayer.GameMapSky)
    }

    private applyGameMapContainer(mapContainer: GameMapContainer): Promise<void> {
        this.clearCurrentMap()

        return new Promise((resolve, reject) => {
            mapContainer.initializeMap().then(() => {
                this.currentMap = mapContainer

                this.addChild(this.currentMap)

                resolve()
            }).catch((error) => {
                Flogger.error('GameMap', 'Error applying GameMapContainer', 'error', error)

                reject()
            })
        })
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
