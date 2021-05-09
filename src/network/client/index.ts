import * as PIXI from 'pixi.js'
import { Key } from 'ts-keycode-enum'
import { InputProcessor } from '../../input/InputProcessor'
import { IGame, Game } from '../../main/Game'
import { GameWindow } from '../../utils/Constants'

window.PIXI = PIXI
global.PIXI = PIXI

const game: IGame = new Game()
let isFullscreen = false

// Startup
game.bootstrap().then(() => {
    const gameCanvas = document.getElementById('game-canvas')

    window.addEventListener('resize', () => {
        game.camera.resize(GameWindow.fullWindowWidth, GameWindow.fullWindowHeight)
        game.renderer.resize(GameWindow.fullWindowWidth, GameWindow.fullWindowHeight)
    })

    // game.view.style.cursor = 'none'

    InputProcessor.on('keydown', (event: KeyboardEvent) => {
        switch (event.which) {
            case Key.F:
                if (isFullscreen)
                isFullscreen = !isFullscreen
                gameCanvas.requestFullscreen()
                break
        }
    })
})
