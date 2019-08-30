'use strict'

class Chat
{
    constructor(){
        this.clients = [];
    }

    addClient = (client) => {
        this.clients.push(client);
        console.log('Added Client '+client.id);
    }

    removeClientById = (id) => {
        this.clients = this.clients.filter((client) => {
            return client.id !== id;
        });
        console.log('Removed Client '+id);
    }

    removeClientByWS = (ws) => {
        this.clients = this.clients.filter((item) => {
            return item.client !== ws;
        });
    }

    processMessage = (wsClient,message) => {
        message = JSON.parse(message);
        if (message.type === 'connect') {
            wsClient.clientId = message.id;
            this.addClient({
              client: wsClient,
              id: message.id
            });
        }
        if (message.type === 'message') {
            console.log(message.name+': '+message.message);
            this.clients.forEach(client => {
                if (client.id !== wsClient.clientId) {
                    client.client.send(JSON.stringify(message));
                }
            })
        }
    }
}
module.exports = Chat;
