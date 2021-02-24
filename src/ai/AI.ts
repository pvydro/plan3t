import { IClientEntity } from "../cliententity/ClientEntity";

export interface IAI {
    initialize(): void
}

export interface AIOptions {
    clientEntity: IClientEntity
}

export abstract class AI implements IAI {
    clientEntity: IClientEntity

    constructor(options: AIOptions) {
        this.clientEntity = options.clientEntity
    }

    initialize() {

    }
}
