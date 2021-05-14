import { Assets } from '../../../asset/Assets'
import { Container } from '../../../engine/display/Container'
import { log } from '../../../service/Flogger'
import { SphericalData } from '../SphericalData'
import { SphericalHelper } from '../SphericalHelper'
import { Tree } from './tree/Tree'

export interface ISphericalNatureBuilder {

}

export class SphericalNatureBuilder implements ISphericalNatureBuilder {
    static totalTrees: number = 3

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
        const minimumTreeDistance = 15
        const maximumTreeDistance = 10
        const startX = Math.floor(Math.random() * minimumTreeDistance)
        
        for (var i = 0; i < this.totalTrees; i++) {
            const tree = new Tree({ treeUrl: this.findTreeAssetUrlForIndex(i) })
            const randomTreeDistance = Math.floor(Math.random() * (maximumTreeDistance * i)) + minimumTreeDistance
            const treeTileX = startX + randomTreeDistance
            const sphericalHeight = data.dimension.height
            const x = treeTileX * SphericalHelper.getTileSize()
            let y = 0

            for (var j = sphericalHeight; j > 0; j--) {
                const point = data.getPointAt(treeTileX, j)

                if (point && point.isSolid()) {
                    y = j * SphericalHelper.getTileSize()
                }
            }

            tree.pos = { x, y }
            
            trees.push(tree)
        }

        return trees
    }

    static findTreeAssetUrlForIndex(index: number) {
        index = index > this.totalTrees - 1 ? (this.totalTrees - 1) : index
        const treeUrl = Assets.BaseImageDir + '/gamemap/trees/tree' + index

        return treeUrl
    }
}
