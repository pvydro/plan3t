import * as PIXI from 'pixi.js'
import { IGame, Game } from '../main/Game'
import { Constants, WindowSize } from '../utils/Constants'

window.PIXI = PIXI
global.PIXI = PIXI

const game: IGame = new Game()

// Startup
game.bootstrap().then(() => {
    window.addEventListener('resize', () => {
        WindowSize.width = window.innerWidth
        WindowSize.height = window.innerHeight

        game.camera.resize(window.innerWidth, window.innerHeight)
        game.renderer.resize(window.innerWidth, window.innerHeight)
    })

    game.view.style.cursor = 'none'
    // return
    document.body.appendChild(game.view)
    
    (window as any).game = game
})
