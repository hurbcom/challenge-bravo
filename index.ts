import express from "express";
import swaggerUi from "swagger-ui-express";
import CurrencyController from "./src/controllers/currency-controller";
const swaggerFile = require('./swagger_output.json')

const app: express.Express = express();
const port = 3000;

app.use(express.json());

CurrencyController.getCurrencyConversion(app);
CurrencyController.saveNewCurrency(app);
CurrencyController.deleteExistingCurrency(app);

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use((err: any, req: any, res: any, next: any) => {
 
  var responseData;

  if (err.name === 'JsonSchemaValidation') {
      // Log the error however you please
      console.log(err.message);
      // logs "express-jsonschema: Invalid data found"

      // Set a bad request http response status or whatever you want
      res.status(400);

      // Format the response body however you want
      responseData = {
         statusText: 'Bad Request',
         jsonSchemaValidation: true,
         validations: err.validations  // All of your validation information
      };

      // Take into account the content type if your app serves various content types
      if (req.xhr || req.get('Content-Type') === 'application/json') {
          res.json(responseData);
      } else {
          // If this is an html request then you should probably have
          // some type of Bad Request html template to respond with
          res.render('badrequestTemplate', responseData);
      }
  } else {
      // pass error to next error middleware handler
      next(err);
  }
});
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })