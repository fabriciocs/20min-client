var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(80);
console.log("Servidor Iniciado na porta '80'");