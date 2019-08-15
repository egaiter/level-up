const WebSocket = require('ws');
const Chat = require('./chat.js');

const wss = new WebSocket.Server({ port: 8080, clientTracking: true });
const chat = new Chat();
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    chat.processMessage(ws,message);
  });
  ws.on('close', (close) => {
    chat.removeClientById(ws.clientId);
    // console.log('Removed Client '+close.target.clientId);
  });
});
wss.on('close', function connection(ws) {
  ws.on('message', function incoming(message) {
    chat.processMessage(ws,message);
    console.log('received: %s', message);
  });
});
