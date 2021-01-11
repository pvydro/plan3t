import { Flogger } from '../../service/Flogger'
import { ClientPlayer, PlayerBodyState, PlayerLegsState } from './ClientPlayer'
import { Key } from 'ts-keycode-enum'
import { InputProcessor } from '../../input/InputProcessor'
import { Camera } from '../../camera/Camera'
import { Direction } from '../../engine/math/Direction'
import { IVector2, Vector2 } from '../../engine/math/Vector2'

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
    downKeyDown: boolean = false
    mousePos: IVector2 = Vector2.Zero

    playerCrouchDivisor: number = 1.75
    playerWalkingSpeed: number = 5
    playerJumpingHeight: number = 15
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
        if (this.downKeyDown) {
            this.duck()
        } else if (this.player.legsState === PlayerLegsState.Crouched) {
            this.standUp()
        }

        this.changeDirectionBasedOnMouse()
    }

    comeToStop() {
        this.player.bodyState = PlayerBodyState.Idle

        this.player.comeToStop()
    }

    standUp() {
        this.player.legsState = PlayerLegsState.Standing
    }

    duck() {
        this.player.legsState = PlayerLegsState.Crouched
    }

    moveLeft() {
        this.player.bodyState = PlayerBodyState.Walking
        this.player.xVel = -this.playerWalkingSpeed / this.walkDivisor
    }

    moveRight() {
        this.player.bodyState = PlayerBodyState.Walking
        this.player.xVel = this.playerWalkingSpeed / this.walkDivisor
    }

    jump() {
        if (!this.player.isOnGround) {
            return
        }
        
        this.player.bodyState = PlayerBodyState.Jumping
        this.player._onGround = false
        this.player.yVel = -this.playerJumpingHeight
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
        Flogger.log('PlayerController', 'addKeyListeners')

        // KeyDown
        InputProcessor.on('keydown', (e: KeyboardEvent) => {
            switch (e.which) {
                case Key.A:
                    this.leftKeyDown = true
                    break
                case Key.D:
                    this.rightKeyDown = true
                    break
                case Key.S:
                    this.downKeyDown = true
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
                case Key.S:
                    this.downKeyDown = false
                    break
            }
        })

        // KeyPress
        InputProcessor.on('keypress', (e: KeyboardEvent) => {
            switch(e.which) {
                case Key.Space:
                    this.jump()
                    break
            }
        })

        // Mouse
        InputProcessor.on('mousemove', (e: MouseEvent) => {
            this.mousePos.x = e.clientX
            this.mousePos.y = e.clientY
        })
    }

    get walkDivisor() {
        return this.player.legsState === PlayerLegsState.Crouched ? this.playerCrouchDivisor : 1
    }
}
