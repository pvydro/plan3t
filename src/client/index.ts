import * as PIXI from 'pixi.js'
import { IGame, Game } from '../main/Game'

window.PIXI = PIXI

const game: IGame = new Game()

// Startup
game.bootstrap().then(() => {
    window.addEventListener('resize', () => {
        console.log('onre')
        game.camera.resize(window.innerWidth, window.innerHeight)
        // game.cameraViewport.resize(window.innerWidth, window.innerHeight)
        game.renderer.resize(window.innerWidth, window.innerHeight)
    })

    document.body.appendChild(game.view)
    
    (window as any).game = game
    
    // allow to resize viewport and renderer
})
