export class Flogger {
  public static isLoggingEnabled: boolean = true
  private static _color: string = 'slategray'
  private static tempColor: string = Flogger._color
  private static style = 'color: ' + Flogger._color
  private static importantStyle = 'color: silver'

  static init() {

  }

  static log(message: string, ...object: any) {
    if (!Flogger.isLoggingEnabled) return

    if (object) {
      console.log(`%c${message}: ${JSON.stringify(object)}`, this.style)
    } else {
      console.log(`%c${message}`, this.style)
    }

    if (this.tempColor) {
      this.tempColor = this._color
      this.style = 'color: ' + this.tempColor
    }
  }

  static importantLog(message: string, ...object: any) {
    if (object) {
      console.log(`%c${message}: ${JSON.stringify(object)}`, this.importantStyle)
    } else {
      console.log(`%c${message}`, this.importantStyle)
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

  static color(temporaryColor: string) {
    this.tempColor = temporaryColor
    this.style = 'color: ' + this.tempColor
  }
}

export function importantLog(message: string, ...object: any) {
  return Flogger.importantLog(message, ...object)
}

export function log(message: string, ...object: any) {
  return Flogger.log(message, ...object)
}

export function loudLog(message: string, ...object: any) {
  console.log(`%c${message}: ${JSON.stringify(object)}`, 'font-size: 200%; color: tomato')
}
