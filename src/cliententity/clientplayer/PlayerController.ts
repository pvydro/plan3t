import { LoggingService } from '../../service/LoggingService'
import { ClientPlayer, PlayerBodyState } from './ClientPlayer'
import { Key } from 'ts-keycode-enum'

export interface IPlayerController {
    update(): void
}

export interface PlayerControllerOptions {
    player: ClientPlayer
}

export class PlayerController implements IPlayerController {
    player: ClientPlayer
    leftKeyDown: boolean = false
    rightKeyDown: boolean = false

    playerWalkingSpeed: number = 5

    constructor(options: PlayerControllerOptions) {
        this.player = options.player

        this.addKeyListeners()
    }

    update() {
        // this.player.y += this.player.yVel
        // this.player.
        if (this.leftKeyDown && this.rightKeyDown
        || !this.leftKeyDown && !this.rightKeyDown) {
            this.comeToStop()
        } else if (this.leftKeyDown) {
            this.moveLeft()
        } else if (this.rightKeyDown) {
            this.moveRight()
        }
    }

    comeToStop() {
        this.player.bodyState = PlayerBodyState.Idle

        const xVel = this.player.xVel + (0 - this.player.xVel) / 20
        this.player.xVel = xVel
    }

    addKeyListeners() {
        LoggingService.log('PlayerController', 'addKeyListeners')

        // KeyDown
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            switch (e.which) {
                case Key.A:
                    // this.moveLeft()
                    this.leftKeyDown = true
                    break
                case Key.D:
                    this.moveRight()
                    this.rightKeyDown = true
                    break
            }
        })

        // KeyUp
        window.addEventListener('keyup', (e: KeyboardEvent) => {
            switch(e.which) {
                case Key.A:
                    this.leftKeyDown = false
                    break
                case Key.D:
                    this.rightKeyDown = false
                    break
            }
        })
    }

    moveLeft() {
        this.player.bodyState = PlayerBodyState.Walking
        this.player.xVel = -5
    }

    moveRight() {
        this.player.bodyState = PlayerBodyState.Walking
        this.player.xVel = 5
    }
}
