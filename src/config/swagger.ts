import swaggerJsdoc from "swagger-jsdoc";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Hurb Currency Exchange",
      version: "1.0.0",
      description:
        "A simple REST API made for Hurb Travelers to convert values between currencies",
      license: {
        name: "MIT License",
        url: "https://choosealicense.com/licenses/mit/"
      },
      contact: {
        name: "Leonardo Moura",
        url: "https://linkedin.com/in/nominal",
        email: "nominal@outlook.com.br"
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.APP_PORT || 3000}`
      }
    ]
  },
  apis: ["docs.yaml"]
};

const swagger = swaggerJsdoc(options);

export default swagger;
