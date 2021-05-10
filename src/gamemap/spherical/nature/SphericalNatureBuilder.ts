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
            const treeX = 360//240
            const treeTileX = treeX / SphericalHelper.getTileSize()
            const sphericalHeight = data.dimension.height
            let treeY = 0

            for (var j = 0; j < sphericalHeight; j++) {
                const point = data.getPointAt(treeTileX, j)

                if (point && point.isSolid()) {
                    treeY = j
                }
            }

            tree.pos = {
                x: treeX - tree.halfWidth,
                y: treeY - tree.height
            }
            
            trees.push(tree)
            // data.getPointAt
            // tree.x = 240
        }

        return trees
    }
}
