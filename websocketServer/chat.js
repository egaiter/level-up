'use strict'

class Chat
{
    constructor(){
        this.clients = [];
    }

    addClient = (client) => {
        this.clients.push(client);
        console.log('Added Client '+client.name+' with id '+client.id);
        let count = this.clients.length;
        this.sendMessage(client,`There ${count === 1 ? 'is' : 'are'} ${count} client${count === 1 ? '' : 's'} connected.`)
        this.clients.forEach((client) => {
            this.sendMessage(client,`${client.name} has joined the chat.`,);
        })
    }

    removeClientById = (id) => {
        let leavingName = null;
        this.clients.forEach((client) => {
            if (client.id === id) {
                leavingName = client.name; 
            }
        });
        this.clients.forEach((client) => {
            this.sendMessage(client,`${leavingName} has left the chat.`,);
        })
        this.clients = this.clients.filter((client) => {
            return client.id !== id;
        });
        console.log('Removed Client '+id);
    }

    processMessage = (wsClient,message) => {
        message = JSON.parse(message);
        if (message.type === 'connect') {
            wsClient.clientId = message.id;
            this.addClient({
              client: wsClient,
              id: message.id,
              name: message.name
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

    sendMessage = (client, message) => {
        let messageObject = {
            name: 'System',
            message: message
        }
        client.client.send(JSON.stringify(messageObject));
    }
}
module.exports = Chat;
