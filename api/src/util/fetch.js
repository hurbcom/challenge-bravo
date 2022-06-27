const nodeFetch = require('node-fetch')

class HTTPResponseError extends Error {
  constructor(response, ...args) {
    super(
      `HTTP Error Response: ${response.status} ${response.statusText}`,
      ...args
    )
  }
}

function createFetcher() {
  return {
    setDefaultHeaders(headers) {
      this.defaultHeaders = headers
    },

    async fetch(url, options = {}) {
      const defaultHeaders = this.defaultHeaders
      const headers = { ...defaultHeaders, ...options.headers }
      const response = await nodeFetch(url, { ...options, headers })
      if (!response.ok) {
        throw new HTTPResponseError(response)
      }
      return response
    },
  }
}

module.exports = { createFetcher, HTTPResponseError }
