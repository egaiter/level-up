const WebSocket = require('ws');
const Chat = require('./chat.js');

const server = new WebSocket.Server({ port: 8080, clientTracking: true });
const chat = new Chat();
server.on('connection', (conn) => {
  conn.on('message', (message) => {
    chat.processMessage(conn,message);
  });
  conn.on('close', (close) => {
    chat.removeClientById(ws.clientId);
  });
});
