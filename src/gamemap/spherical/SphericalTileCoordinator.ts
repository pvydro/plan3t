import { IVector2, Vector2 } from "../../engine/math/Vector2";
import { SphericalHelper } from "./SphericalHelper";
import { ISphericalPoint } from "./SphericalPoint";

export interface ISphericalTileCoordinator {

}

/**
 * TODO
 * Instead of static, instantiating this pre-build would give more fine grain control
 */
export class SphericalTileCoordinator implements ISphericalTileCoordinator {
    private constructor() {

    }

    static checkLeftAndRight(point: ISphericalPoint, coords: IVector2): IVector2 {
        if (point.rightPoint !== undefined
        && point.leftPoint !== undefined) {
            coords.x = 1
        } else if (point.rightPoint !== undefined) {
            coords.x = 0
        } else if (point.leftPoint !== undefined) {
            coords.x = 2
        }

        return coords
    }

    static checkTopAndBottom(point: ISphericalPoint, coords: IVector2): IVector2 {
        if (point.topPoint !== undefined
        && point.bottomPoint !== undefined) {
            coords.y = 1
        } else if (point.topPoint !== undefined) {
            coords.y = 2
        } else if (point.bottomPoint !== undefined) {
            coords.y = 0
        }

        return coords
    }

    static checkTopCorners(point: ISphericalPoint, coords: IVector2): IVector2 {
        if (point.topPoint !== undefined) {
            if (point.isEqualToPoint(point.topPoint)
            && point.isEqualToPoint(point.leftPoint)
            && point.topLeftPoint == undefined) {

                coords.x = 3
                coords.y = 0

            } else if (point.isEqualToPoint(point.topPoint)
            && point.isEqualToPoint(point.rightPoint)
            && point.topRightPoint == undefined) {

                coords.x = 4
                coords.y = 0

            }
        }

        return coords
    }

    static checkBottomCorners(point: ISphericalPoint, coords: IVector2): IVector2 {
        if (point.bottomPoint !== undefined) {
            if (point.isEqualToPoint(point.bottomPoint)
            && point.isEqualToPoint(point.leftPoint)
            && !point.bottomLeftPoint == undefined) {

                coords.x = 3
                coords.y = 1

            } else if (point.isEqualToPoint(point.topPoint)
            && point.isEqualToPoint(point.rightPoint)
            && point.bottomRightPoint == undefined) {

                coords.x = 4
                coords.y = 1

            }
        }

        return coords
    }
}
