const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  // List of files to be processed.
  apis: ['./**/*.router.js'],
  // You can also set globs for your apis
  // e.g. './routes/*.js'
  host : 'localhost:5000/',
  basePath: 'api/',
  swaggerDefinition: {
    info: {
      description: 'API documentation',
      swagger: '2.0',
      title: 'ExchangeBookas API',
      version: '1.0.0',
    },
  },
};

const specs = swaggerJsdoc(options);
module.exports = specs;