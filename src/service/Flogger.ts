export class Flogger {
  public static isLoggingEnabled: boolean = true
  private static tempColor: string = 'orange'

  static init() {

  }

  static log(message: string, ...object: any) {
    if (!Flogger.isLoggingEnabled) return

    const style = 'color: ' + this.tempColor

    if (object) {
      console.log(`%c${message}: ${JSON.stringify(object)}`, style)
    } else {
      console.log(`%c${message}`, style)
    }

    this.tempColor = 'orange'
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

  static color(temporaryColor: string) {
    this.tempColor = temporaryColor
  }
}
