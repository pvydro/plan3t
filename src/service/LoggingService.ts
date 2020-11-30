export default class LoggingService {
    public static isLoggingEnabled: boolean = true
  
    static init() {
  
    }
  
    static log(message: string, ...object: any) {
      if (!LoggingService.isLoggingEnabled) return
      
      if (object) {
        console.log(`%c${message}: ${JSON.stringify(object)}`, 'color: orange')
      } else {
        console.log(`%c${message}`, 'color: orange')
      }
    }
  
    static warn(message: string, ...object: any) {
      if (object) {
        console.warn(`${message}: ${JSON.stringify(object)}`)
      } else {
        console.warn(`${message}`)
      }
    }
  
    static error(message: string, ...object: any) {
      if (object) {
        console.error(`${message}: ${JSON.stringify(object)}`)
      } else {
        console.error(`${message}`)
      }
    }
  
    static assert(condition: any, message?: string) {
      console.assert(condition, message)
    }
  }
  