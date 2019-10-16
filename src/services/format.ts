class Format {
  public keysToList (object: object): Array<string> {
    let list: Array<string> = []
    Object.keys(object).forEach(key => {
      list = [...list, key]
    })
    return list
  }
}

export default new Format()
