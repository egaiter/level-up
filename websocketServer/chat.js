'use strict'

class Chat
{
    constructor(){
        this.clients = [];
    }

    addClient = (client) => {
        this.clients.push(client);
        console.log('Added Client '+client.id);
        let count = this.clients.length;
        this.sendMessage(client,`There ${count === 1 ? 'is' : 'are'} ${count} client${count === 1 ? '' : 's'} connected.`)
    }

    removeClientById = (id) => {
        this.clients = this.clients.filter((client) => {
            return client.id !== id;
        });
        console.log('Removed Client '+id);
    }

    processMessage = (wsClient,message) => {
        message = JSON.parse(message);
        if (message.type === 'connect') {
            // Tag the websocket object and add the client to our internal list of clients
            wsClient.clientId = message.id;
            this.addClient({
              connection: wsClient,
              id: message.id
            });
        }
        if (message.type === 'message') {
            console.log(message.name+': '+message.message);
            this.clients.forEach(client => {
                if (client.id !== wsClient.clientId) {
                    client.connection.send(JSON.stringify(message));
                }
            })
        }
    }

    sendMessage = (client, message) => {
        let messageObject = {
            name: 'System',
            message: message
        }
        client.connection.send(JSON.stringify(messageObject));
    }
}
module.exports = Chat;
