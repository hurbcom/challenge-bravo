export function makeMockResponse () {
  const response = {
    state: {}
  }

  response.status = (status) => {
    response.state.status = status
    return response
  }

  response.json = (json) => {
    response.state.json = json
    return response
  }

  return response
}
