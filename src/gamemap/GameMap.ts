import { GameMapHelper } from './GameMapHelper'
import { IDemolishable } from '../interface/IDemolishable'
import { Flogger } from '../service/Flogger'
import { Spherical } from './spherical/Spherical'
import { Container } from '../engine/display/Container'
import { GlobalScale } from '../utils/Constants'
import { Rect } from '../engine/math/Rect'
import { GameMapSky } from './GameMapSky'
import { IUpdatable } from '../interface/IUpdatable'

export interface IGameMap extends IDemolishable, IUpdatable {
    initializeSpherical(): Promise<void>
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
    async initializeSpherical(seed?: string) {
        Flogger.log('GameMap', 'initializeSpherical')

        GameMapHelper.getRandomSphericalData().then((sphericalData) => {
            const spherical = new Spherical(sphericalData)

            this.currentSpherical = spherical

            this.addChild(this.currentSpherical)
        })
    }

    demolish() {
        Flogger.log('GameMap', 'demolish')
    }

    get collidableRects() {
        return (this.currentSpherical && this.currentSpherical.collisionRects) ? this.currentSpherical.collisionRects : []
    }
}
