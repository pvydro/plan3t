import { LoggingService } from '../../service/LoggingService'
import { ClientPlayer, PlayerBodyState } from './ClientPlayer'
import { Key } from 'ts-keycode-enum'
import { InputProcessor } from '../../input/InputProcessor'
import { Camera } from '../../camera/Camera'
import { Direction } from '../../math/Direction'

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
    mousePos: PIXI.IPoint = new PIXI.Point(0, 0)

    playerWalkingSpeed: number = 5
    floorFriction = 5

    constructor(options: PlayerControllerOptions) {
        this.player = options.player

        this.addListeners()
    }

    update() {
        if (this.leftKeyDown && this.rightKeyDown
        || !this.leftKeyDown && !this.rightKeyDown) {
            this.comeToStop()
        } else if (this.leftKeyDown) {
            this.moveLeft()
        } else if (this.rightKeyDown) {
            this.moveRight()
        }

        this.changeDirectionBasedOnMouse()
    }

    comeToStop() {
        this.player.bodyState = PlayerBodyState.Idle

        const xVel = this.player.xVel + (0 - this.player.xVel) / this.floorFriction
        this.player.xVel = xVel
    }

    moveLeft() {
        this.player.bodyState = PlayerBodyState.Walking
        this.player.xVel = -this.playerWalkingSpeed
    }

    moveRight() {
        this.player.bodyState = PlayerBodyState.Walking
        this.player.xVel = this.playerWalkingSpeed
    }

    changeDirectionBasedOnMouse() {
        const projectedPlayerPos = Camera.getInstance().viewport.toScreen(this.player.position)

        if (this.mousePos.x < projectedPlayerPos.x) {
            this.player.direction = Direction.Left
        } else if (this.mousePos.x > projectedPlayerPos.x) {
            this.player.direction = Direction.Right
        }
    }

    addListeners() {
        LoggingService.log('PlayerController', 'addKeyListeners')

        // KeyDown
        InputProcessor.on('keydown', (e: KeyboardEvent) => {
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
        InputProcessor.on('keyup', (e: KeyboardEvent) => {
            switch(e.which) {
                case Key.A:
                    this.leftKeyDown = false
                    break
                case Key.D:
                    this.rightKeyDown = false
                    break
            }
        })

        // Mouse
        InputProcessor.on('mousemove', (e: MouseEvent) => {
            this.mousePos.x = e.clientX
            this.mousePos.y = e.clientY
        })
    }
}
