import HttpClient, { Options, Settings } from "@/infra/http-client/http-client"
import axios from "axios"

export class AxiosAdapter extends HttpClient {
  api: axios.AxiosInstance

  constructor(settings: Settings = { baseURL: '', headers: {} }) {
    super(settings)
    this.api = axios.create({
      baseURL: settings.baseURL,
      headers: settings.headers
    })
  }

  async get<T>(url: string, options?: Options): Promise<T> {
    const response = await this.api.get<T>(url, options)
    return response.data
  }

  setSettings(settings: { [k in keyof Settings]?: Settings[k] }): void {
    if (settings.baseURL) this.api.defaults.baseURL = settings.baseURL
    if (settings.headers) {
      for (const key in settings.headers) {
        this.api.defaults.headers[key] = settings.headers[key]
      }
    }
  }

}