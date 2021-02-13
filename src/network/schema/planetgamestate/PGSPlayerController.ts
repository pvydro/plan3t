import { Player } from '../../rooms/Player'
import { PlanetGameState } from './PlanetGameState'
import { PlayerBodyState, Direction, PlayerLegsState } from '../../utils/Enum'
import { PlanetRoom } from '../../rooms/planetroom/PlanetRoom'
import { PixiPlugin } from 'gsap/all'

export interface IPGSPlayerController {
    update(): void
}

export class PGSPlayerController implements IPGSPlayerController {
    state: PlanetGameState

    constructor(state: PlanetGameState) {
        this.state = state
    }

    update() {
        const playerCrouchDivisor: number = 1.75
        const playerWalkingSpeed: number = 1.5
        const playerJumpingHeight: number = 5
        const horizontalFriction: number = 5

        this.players.forEach((p: Player) => {
            // Body state
            switch (p.bodyState) {
                case PlayerBodyState.Idle:

                    // p.comeToStop()
                    if (p.xVel !== 0) {
                        p.xVel += ((0 - p.xVel) / horizontalFriction) * PlanetRoom.Delta
                        if (p.xVel <= 0.0001) p.xVel = 0
                    }

                    break
                case PlayerBodyState.Walking:

                    if (p.walkingDirection === Direction.Left) {

                        // p.moveLeft()
                        if (p.xVel !== -playerWalkingSpeed) {
                            p.xVel = -playerWalkingSpeed
                        }

                    } else if (p.walkingDirection === Direction.Right) {

                        // p.moveRight()
                        if (p.xVel !== playerWalkingSpeed) {
                            p.xVel = playerWalkingSpeed
                        }

                    }

                    break
            }

            // Legs state
            switch (p.legsState) {
                case PlayerLegsState.Jumping:
                    if (p.isOnGround) {
                        p.yVel = -playerJumpingHeight
                        p.isOnGround = false
                    }
                    break
            }

            if (p.isOnGround === false && p.yVel !== 0) {
                p.yVel += ((p.weight / 3) * 1) * PlanetRoom.Delta
            }
        })
    }

    get players() {
        return this.state.players
    }

    get planetSpherical() {
        return this.state.planetSpherical
    }
}
