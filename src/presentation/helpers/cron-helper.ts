interface daily {
    at(fullHour: string): string
  }

interface every {
    seconds(): string
    minutes(): string
    hours(): string
    days(): daily
  }

class Every implements every {
  constructor (protected readonly param = 1) { }
  seconds (): string {
    return `*/${this.param} * * * * *`
  }

  minutes (): string {
    return `* */${this.param} * * *`
  }

  hours (): string {
    return `0 0/${this.param} * * *`
  }

  days (): daily {
    return new Daily(this.param)
  }
}
class Daily implements daily {
  constructor (protected readonly day = 1) {}
  at (fullHour: string): string {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    const isHour = regex.test(fullHour)
    if (isHour) {
      const hour = parseInt(fullHour.split(':')[0]).toString()
      const minutes = parseInt(fullHour.split(':')[1]).toString()

      return `${minutes} ${hour} */${this.day} * *`
    }
    return `0 0 */${this.day} * *`
  }
}

export class CronHelper {
  constructor (protected readonly task?: CallableFunction) { }
    public every = (param?: number): every => {
      return new Every(param)
    }

    public daily = (): daily => (new Daily())
}
