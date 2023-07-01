const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./app.js"];

const doc = {
  info: {
    version: "1.0.0",
    title: "API Estudante Voluntario",
    description: "Documentação da API Estudante Voluntário",
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http", "https"],
  servers: [
    {
      url: "http://localhost:3000",
    }
  ],
  consumes: ["application/json"],
  apis: ["./app.js"],
  produces: ['application/json'],
  securityDefinitions: {
    JWT: {
      description: 'JWT token',
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    },
  },
  definitions: {
  },
  
};

swaggerAutogen(outputFile, endpointsFiles, doc);
