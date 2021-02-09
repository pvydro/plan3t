import { Player } from '../../rooms/Player'
import { PlanetGameState } from './PlanetGameState'
import { PlayerBodyState, Direction } from '../../utils/Enum'

export interface IPlanetGameStatePlayerController {
    update(): void
}

export class PlanetGameStatePlayerController implements IPlanetGameStatePlayerController {
    state: PlanetGameState

    constructor(state: PlanetGameState) {
        this.state = state
    }

    update() {
        const playerCrouchDivisor: number = 1.75
        const playerWalkingSpeed: number = 1.5
        const playerJumpingHeight: number = 5
        const floorFriction: number = 5

        this.players.forEach((p: Player) => {
            switch (p.bodyState) {
                case PlayerBodyState.Idle:

                    // p.comeToStop()
                    if (p.xVel !== 0) {
                        p.xVel = 0
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
            
            p.x += p.xVel
        })
    }

    get players() {
        return this.state.players
    }

    get planetSpherical() {
        return this.state.planetSpherical
    }
}
