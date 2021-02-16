exports.configureSockerIO = function (server) {
  return require('../socket').init(server, {
    cors: {
      origin: 'http://localhost:3001/',
      methods: ['GET', 'POST'],
    },
  });
};
