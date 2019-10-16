class Format {
  public KeysToString (object: object): string {
    let list: Array<string> = []
    Object.keys(object).forEach(key => {
      list = [...list, key]
    })
    return list.join()
  }
}

export default new Format()
