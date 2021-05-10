import { Container } from '../../../engine/display/Container'
import { log } from '../../../service/Flogger'
import { SphericalData } from '../SphericalData'
import { SphericalHelper } from '../SphericalHelper'
import { Tree } from './tree/Tree'

export interface ISphericalNatureBuilder {

}

export class SphericalNatureBuilder implements ISphericalNatureBuilder {
    constructor() {
        
    }

    static async buildNatureFromData(data: SphericalData): Promise<Container> {
        log('SphericalNatureBuilder', 'buildNatureFromData')

        const natureContainer = new Container()
        const trees = await this.buildTreesFromData(data)

        for (var i in trees) {
            const tree = trees[i]

            natureContainer.addChild(tree)
        }

        return natureContainer
    }

    private static async buildTreesFromData(data: SphericalData): Promise<Tree[]> {
        log('SphericalNatureBuilder', 'buildTreesFromData')

        const trees = []
        const totalTrees = 1
        
        for (var i = 0; i < totalTrees; i++) {
            const tree = new Tree()
            const treeTileX = 30
            const sphericalHeight = data.dimension.height
            const x = treeTileX * SphericalHelper.getTileSize()
            let y = 0

            for (var j = sphericalHeight; j > 0; j--) {
                const point = data.getPointAt(treeTileX, j)

                if (point && point.isSolid()) {
                    y = j
                }
            }

            tree.pos = { x, y }
            
            trees.push(tree)
        }

        return trees
    }
}
