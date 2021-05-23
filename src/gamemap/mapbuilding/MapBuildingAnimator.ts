import { PositionAndAlphaAnimateable } from '../../engine/display/Animator'
import { ISprite } from '../../engine/display/Sprite'

export interface IMapBuildingAnimator {
    getTransitionOutElements(): PositionAndAlphaAnimateable[]
}

export interface MapBuilderAnimatorOptions {
    floorSprite: ISprite
    backgroundSprite: ISprite
}

export class MapBuildingAnimator implements IMapBuildingAnimator {
    floorSprite: ISprite
    backgroundSprite: ISprite

    constructor(options: MapBuilderAnimatorOptions) {
        this.floorSprite = options.floorSprite
        this.backgroundSprite = options.backgroundSprite
    }

    getTransitionOutElements(): PositionAndAlphaAnimateable[] {
        return [ this.floorSprite, this.backgroundSprite ]
    }
}
