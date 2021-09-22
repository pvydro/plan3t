import { PositionAndAlphaAnimateable } from '../../engine/display/Animator'
import { IContainer } from '../../engine/display/Container'
import { ISprite } from '../../engine/display/Sprite'
import { IMapBuildingFloor } from './MapBuildingFloor'

export interface IMapBuildingAnimator {
    getTransitionOutElements(): PositionAndAlphaAnimateable[]
}

export interface MapBuilderAnimatorOptions {
    floor: IMapBuildingFloor
    backgroundSprite: IContainer//ISprite
}

export class MapBuildingAnimator implements IMapBuildingAnimator {
    floor: IMapBuildingFloor
    backgroundSprite: IContainer//ISprite

    constructor(options: MapBuilderAnimatorOptions) {
        this.floor = options.floor
        this.backgroundSprite = options.backgroundSprite
    }

    getTransitionOutElements(): PositionAndAlphaAnimateable[] {
        return [ this.floor, this.backgroundSprite ]
    }
}
