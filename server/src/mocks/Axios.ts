const ignoreTheseCoins = ['GSP', 'UPT']
const response = `{"time":"2023-02-09T17:08:27.0000000Z","asset_id_base":"BRL","asset_id_quote":"USD","rate":0.1899306898585259}`

export default {
  get: (url: string) => {
    console.log('url:::', url)
    const splited = url.split('/')
    const to = splited[splited.length - 2]
    const from = splited[splited.length - 3]

    if (ignoreTheseCoins.includes(from) || ignoreTheseCoins.includes(to)) {
      throw new Error('Coin not found')
    }

    return {
      data: JSON.parse(response)
    }
  }
}
