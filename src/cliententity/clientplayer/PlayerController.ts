import { Flogger } from '../../service/Flogger'
import { ClientPlayer, PlayerBodyState, PlayerConsciousnessState, PlayerLegsState } from './ClientPlayer'
import { Key } from 'ts-keycode-enum'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { Direction } from '../../engine/math/Direction'
import { IVector2, Vector2 } from '../../engine/math/Vector2'
import { DebugConstants, GameWindow } from '../../utils/Constants'

export interface IPlayerController {
    update(): void
    forceTriggerJump(): void
}

export interface PlayerControllerOptions {
    player: ClientPlayer
}

export class PlayerController implements IPlayerController {
    player: ClientPlayer
    leftKeyDown: boolean = false
    rightKeyDown: boolean = false
    downKeyDown: boolean = false
    sprintKeyDown: boolean = false
    spaceKeyPressed: boolean = false
    mousePos: IVector2 = Vector2.Zero

    playerCrouchDivisor: number = 1.75
    playerWalkingSpeed: number = 1
    playerSprintMultiplier: number = 1.25
    playerJumpingHeight: number = 5
    floorFriction = 5

    constructor(options: PlayerControllerOptions) {
        this.player = options.player

        this.addListeners()
    }

    update() {
        if (this.player.consciousnessState === PlayerConsciousnessState.Controlled) {
            this.player.xVel = 0
            this.player.yVel = 0
        } else if (this.player.consciousnessState === PlayerConsciousnessState.Dead) {
            this.comeToStop()
        } else if (this.player.isClientPlayer) {
            if (this.leftKeyDown && this.rightKeyDown
            || !this.leftKeyDown && !this.rightKeyDown) {
                this.comeToStop()
            } else if (this.leftKeyDown) {
                this.moveLeft()
            } else if (this.rightKeyDown) {
                this.moveRight()
            }

            if (this.downKeyDown) {
                this.crouch()
            } else if (this.player.legsState === PlayerLegsState.Crouched) {
                this.standUp()
            }

            if (this.spaceKeyPressed) {
                this.spaceKeyPressed = false
                this.jump()
            }

            this.changeDirectionBasedOnMouse()
        }

        // State based movement
        const bodyState = this.player.bodyState
        const legsState = this.player.legsState
        const walkingDirection = this.player.walkingDirection
        const superSprint = (DebugConstants.SuperSprint)
        let walkMultiplier = this.player.bodyState === PlayerBodyState.Sprinting
            ? (superSprint
                ? this.playerSprintMultiplier * 3
                : this.playerSprintMultiplier)
            : 1
        const targetXVel = ((this.playerWalkingSpeed * walkingDirection) / this.walkDivisor)
            * walkMultiplier

        switch (bodyState) {
            case PlayerBodyState.Sprinting:
            case PlayerBodyState.Walking:

                this.player.xVel = targetXVel
                
                break
            case PlayerBodyState.Idle:

                this.player.comeToStop()

                break
        }

        switch (legsState) {
            case PlayerLegsState.Standing:

            break
            case PlayerLegsState.Jumping:
                if (this.player.isOnGround) {
                    this.triggerJump()
                } else if (this.player.yVel > 0) {
                    this.player.legsState = PlayerLegsState.Standing
                }
            break
        }
    }

    comeToStop() {
        this.player.bodyState = PlayerBodyState.Idle
    }

    standUp() {
        this.player.legsState = PlayerLegsState.Standing
    }

    crouch() {
        this.player.legsState = PlayerLegsState.Crouched
    }

    moveLeft() {
        if (this.player.isOnWallLeft) this.comeToStop()

        this.player.walkingDirection = Direction.Left
        this.player.bodyState = this.sprintKeyDown ? PlayerBodyState.Sprinting : PlayerBodyState.Walking
    }

    moveRight() {
        if (this.player.isOnWallRight) this.comeToStop()

        this.player.walkingDirection = Direction.Right
        this.player.bodyState = this.sprintKeyDown ? PlayerBodyState.Sprinting : PlayerBodyState.Walking
    }

    jump() {
        if (!this.player.isOnGround) return
        
        this.player.legsState = PlayerLegsState.Jumping
    }

    private triggerJump() {
        // if (!this.player.isOnGround) {
        //     return
        // }

        // this.player.onGround = false
        // this.player.yVel = -this.playerJumpingHeight
        this.player.jump()
    }

    forceTriggerJump() {
        this.player._onGround = true
        this.triggerJump()
    }

    changeDirectionBasedOnMouse() {
        const projectedPlayerPos = {
            x: GameWindow.width / 2,
            y: GameWindow.height / 2
        }

        if (this.mousePos.x < projectedPlayerPos.x) {
            this.player.direction = Direction.Left
        } else if (this.mousePos.x > projectedPlayerPos.x) {
            this.player.direction = Direction.Right
        }
    }

    addListeners() {
        Flogger.log('PlayerController', 'addKeyListeners')

        // KeyDown
        InputProcessor.on(InputEvents.KeyDown, (e: KeyboardEvent) => {
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
                case Key.Shift:
                    this.sprintKeyDown = true
                    break
            }
        })

        // KeyUp
        InputProcessor.on(InputEvents.KeyUp, (e: KeyboardEvent) => {
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
                case Key.Shift:
                    this.sprintKeyDown = false
                    break
            }
        })

        // KeyPress
        InputProcessor.on(InputEvents.KeyPress, (e: KeyboardEvent) => {
            switch(e.which) {
                case Key.Space:
                    this.spaceKeyPressed = true
                    break
            }
        })

        // Mouse
        InputProcessor.on(InputEvents.MouseMove, (e: MouseEvent) => {
            this.mousePos.x = e.clientX
            this.mousePos.y = e.clientY
        })
    }

    get walkDivisor() {
        return this.player.legsState === PlayerLegsState.Crouched ? this.playerCrouchDivisor : 1
    }
}
