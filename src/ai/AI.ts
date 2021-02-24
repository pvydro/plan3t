import { IClientEntity } from "../cliententity/ClientEntity";

export interface IAI {
    clientEntity: IClientEntity
    initialize(): void
}

export interface AIOptions {
    clientEntity: IClientEntity
}

export abstract class AI implements IAI {
    _clientEntity: IClientEntity

    constructor(options: AIOptions) {
        this._clientEntity = options.clientEntity
    }

    initialize() {

    }

    get clientEntity() {
        return this._clientEntity
    }
}
