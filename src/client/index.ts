import * as PIXI from 'pixi.js'
import { Key } from 'ts-keycode-enum'
import { InputProcessor } from '../input/InputProcessor'
import { IGame, Game } from '../main/Game'
import { WindowSize } from '../utils/Constants'

window.PIXI = PIXI
global.PIXI = PIXI

const game: IGame = new Game()
let isFullscreen = false

// Startup
game.bootstrap().then(() => {
    const gameCanvas = document.getElementById('game-canvas')

    window.addEventListener('resize', () => {
        WindowSize.width = window.innerWidth
        WindowSize.height = window.innerHeight

        game.camera.resize(window.innerWidth, window.innerHeight)
        game.renderer.resize(window.innerWidth, window.innerHeight)
    })

    game.view.style.cursor = 'none'

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
