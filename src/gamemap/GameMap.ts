import { GameMapHelper } from './GameMapHelper'
import { IDemolishable } from '../interface/IDemolishable'
import { Flogger } from '../service/Flogger'
import { Spherical } from './spherical/Spherical'
import { Container } from '../engine/display/Container'
import { GlobalScale } from '../utils/Constants'
import { Rect } from '../engine/math/Rect'

export interface IGameMap extends IDemolishable {
    initializeSpherical(): Promise<void>
    demolish(): void
    collidableRects: Rect[]
}

export class GameMap extends Container implements IGameMap {
    private static INSTANCE?: GameMap
    currentSpherical?: Spherical
    
    static getInstance() {
        if (GameMap.INSTANCE === undefined) {
            GameMap.INSTANCE = new GameMap()
        }

        return GameMap.INSTANCE
    }

    private constructor() {
        super()

        this.scale.set(GlobalScale, GlobalScale)
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
