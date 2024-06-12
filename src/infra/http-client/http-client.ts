export abstract class HttpClient {
  constructor(protected readonly settings: Settings) {
    this.setSettings(settings)
  }
  abstract setSettings(settings: { [k in keyof Settings]?: Settings[k] }): void
  abstract get<T>(url: string, options?: Options): Promise<T>
}

export type Settings = {
  baseURL: string
  headers: { [key: string]: string }
}

export type Options = {
  params?: { [key: string]: any }
  headers?: { [key: string]: string }
}

export default HttpClient