export const makeMockRequest = ({ params, query, body }) => {
  const request = {
    params: params || { },
    query: query || { },
    body: body || { }
  }

  return request
}
