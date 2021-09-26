import { Assets } from '../../asset/Assets'
import { importantLog, log, logError } from '../../service/Flogger'
import { MapBuildingType } from './MapBuilding'
const allDecorations = require('../../json/BiomeDecorations.json')

export class DecorationDirectory {
    private static decorationsByType: Map<MapBuildingType, string[]> = new Map()
    static allDecorations: string[] = allDecorations

    private constructor() {}

    static async assembleDirectory() {
        log('DecorationDirectory', 'assembleDirectory')

        Object.values(MapBuildingType).forEach((value: MapBuildingType) => {
            // console.log('value', value)
            log('Collecting decorations for ', value)
            const decorationsDir = `${Assets.MapBuildingDir}${value}/decorations/`
            const decorations = []

            this.allDecorations.forEach((decor: string) => {
                if (decor.includes(decorationsDir)) {
                    importantLog(`decorDir is of type ${value}, ${decor}`)

                    decorations.push(decor)
                }
            })
            
            this.decorationsByType.set(value, decorations)
        })

        console.log(this.decorationsByType)
    }

    static getDecorationsForType(type: MapBuildingType): string[] {
        return this.decorationsByType.get(type)
    }
}