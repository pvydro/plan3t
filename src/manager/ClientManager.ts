import { Client } from "colyseus.js";
import { ENDPOINT } from '../network/Network'
import { Camera, ICamera } from '../camera/Camera'
import { IEntityManager } from '../manager/EntityManager'

export interface IClientManager {
    client: Client
    clientCamera: ICamera
    entityManager: IEntityManager
    initialize(): Promise<void>
}

export interface ClientManagerOptions {
    entityManager: IEntityManager
    camera: ICamera
}

export class ClientManager implements ClientManager {
    _client: Client
    _camera: ICamera

    _entityManager: IEntityManager

    constructor(options: ClientManagerOptions) {
        this._camera = options.camera
        this._entityManager = options.entityManager
    }

    async initialize() {
        this._client = new Client(ENDPOINT)
    }

    get client() {
        return this._client
    }

    get clientCamera() {
        return this._camera
    }

    get entityManager() {
        return this._entityManager
    }
}