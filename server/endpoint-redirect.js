module.exports = (controller) => {
    return (req, res) => {
      const httpRequest = {
        body: req.body,
        query: req.query,
        params: req.params,
        ip: req.ip,
        method: req.method,
        path: req.path,
        headers: {
          'Content-Type': req.get('Content-Type'),
          Referer: req.get('referer'),
          'User-Agent': req.get('User-Agent')
        }
      }
      controller(httpRequest)
        .then(({ headers, statusCode, url, query, params }) => {
          if(headers){
            res.set(headers)
          }
  
          res.type('json')
          res.status(statusCode).redirect(`${url}/${query}/${params}`)
        })
        .catch(err => res.status(500).send({error: 'An unknown error has ocurred.', message: err}))
    }
  }