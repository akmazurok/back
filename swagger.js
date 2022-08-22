const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./app.js"];

const doc = {
  info: {
    version: "1.0.0",
    title: "API Estudante Voluntario",
    description: "Documentação da API Estudante Voluntário",
  },
  host: "localhost:2000",
  basePath: "/",
  schemes: ["http", "https"],
  servers: [
    {
      url: "http://localhost:3000",
    }
  ],
  consumes: ["application/json"],
  apis: ["./app.js"],
  components: {
    schemas: {
      Usuario: {
        type: "object",
        properties: {
          documento: { type: String },
          email: { type: String },
          senha: { type: String },
          acesso: {
            type: String,
            enum: ["Administrador", "Estudante", "Entidade"],
          },
        },
      },
    },
  },
  /*  securityDefinitions: {
        api_key: {
            type: "apiKey",
            name: "api_key",
            in: "header"
        },
        petstore_auth: {
            type: "oauth2",
            authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
               flow: "implicit",
            scopes: {
                read_pets: "read your pets",
                write_pets: "modify pets in your account"
            }
        }
    }, */
};

swaggerAutogen(outputFile, endpointsFiles, doc);
