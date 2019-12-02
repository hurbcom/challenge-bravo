import path from 'path'
import SwaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    info: {
      title: 'Challenge Bravo',
      version: '1.0.0',
      description: 'API de conversão monetária'
    }
  },
  apis: [path.resolve(__dirname, '..', 'routes.js')],
  basePath: '/'
}

export default SwaggerJSDoc(options)
