export interface IInGameChatService {

}

export class InGameChatService implements IInGameChatService {
    private static _messageHistory: string = `Hey\nHey\nWhat's up\nJust coding\nCool`

    private constructor() {
        throw new Error('InGameChatService should not be instantiated')
    }

    static get messageLogAsString() {
        return InGameChatService._messageHistory
    }
}
