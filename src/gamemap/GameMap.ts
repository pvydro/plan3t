import { GameMapHelper } from './GameMapHelper'
import { IDemolishable } from '../interface/IDemolishable'
import { Flogger } from '../service/Flogger'
import { Spherical } from './spherical/Spherical'
import { Container } from '../engine/display/Container'
import { GlobalScale } from '../utils/Constants'
import { Rect } from '../engine/math/Rect'
import { GameMapSky } from './GameMapSky'
import { IUpdatable } from '../interface/IUpdatable'
import { SphericalData } from './spherical/SphericalData'

export interface IGameMap extends IDemolishable, IUpdatable {
    initializeRandomSpherical(): Promise<void>
    demolish(): void
    collidableRects: Rect[]
}

export class GameMap extends Container implements IGameMap {
    private static INSTANCE?: GameMap
    currentSpherical?: Spherical

    sky: GameMapSky
    
    static getInstance() {
        if (GameMap.INSTANCE === undefined) {
            GameMap.INSTANCE = new GameMap()
        }

        return GameMap.INSTANCE
    }

    private constructor() {
        super()

        this.sky = new GameMapSky()
        this.addChild(this.sky)

        this.scale.set(GlobalScale, GlobalScale)
    }

    update() {
        this.sky.update()
    }

    // TODO: Seed
    async initializeRandomSpherical(): Promise<void> {
        Flogger.log('GameMap', 'initializeRandomSpherical')

        const randomSphericalData = await GameMapHelper.getRandomSphericalData()
        const randomSpherical = new Spherical(randomSphericalData)

        await this.applySpherical(randomSpherical)
    }

    async initializePremadeSpherical(data: SphericalData) {
        Flogger.log('GameMap', 'initializePremadeSpherical')

        const spherical = new Spherical(data)

        await this.applySpherical(spherical)
    }

    private applySpherical(spherical: Spherical): Promise<void> {
        if (this.currentSpherical !== undefined) {
            this.currentSpherical.demolish()
            this.removeChild(this.currentSpherical)
        }

        return new Promise((resolve, reject) => {
            spherical.initializeSpherical().then(() => {
                this.currentSpherical = spherical

                this.addChild(this.currentSpherical)

                resolve()
            }).catch((error) => {
                Flogger.error('GameMap', 'Error applying Spherical', 'error', error)

                reject()
            })
        })
    }

    demolish() {
        Flogger.log('GameMap', 'demolish')
    }

    get collidableRects() {
        return (this.currentSpherical && this.currentSpherical.collisionRects) ? this.currentSpherical.collisionRects : []
    }
}
