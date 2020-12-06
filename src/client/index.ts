import * as PIXI from 'pixi.js'
import { IGame, Game } from '../main/Game'
import { ClientManager } from '../manager/ClientManager'
import { RoomManager } from '../manager/RoomManager'
import { EntityManager } from '../manager/EntityManager'
import { Camera } from '../camera/Camera'

window.PIXI = PIXI

const camera = Camera.getInstance()
const entityManager = new EntityManager({ camera })
const clientManager = new ClientManager({ entityManager, camera })
const roomManager = new RoomManager({ clientManager })

const game: IGame = new Game({
    clientManager,
    roomManager,
    entityManager,
})

// Startup
game.bootstrap().then(() => {
    document.body.appendChild(game.view);
    
    (window as any).game = game;
    
    // allow to resize viewport and renderer
    window.onresize = () => {
        game.cameraViewport.resize(window.innerWidth, window.innerHeight);
        game.renderer.resize(window.innerWidth, window.innerHeight);
    }
})
