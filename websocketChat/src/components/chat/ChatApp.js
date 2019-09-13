class ChatApp {

  constructor() {
      this.isConnected = false;
      this.connection = null;
      this.serverUrl = '';
      this.id = '';
      this.chatInputText = '';
      this.chatContents = '';
      this.bufferedMessages = [];
      this.name = '';
      this.refreshCallbacks = [];
    }

  updateHook = () => {
    this.refreshCallbacks.forEach((callback) => {
      callback();
    });
  }

  setId = (id) => { this.id = id; this.updateHook(); }
  setName = (name) => { this.name = name; this.updateHook(); }
  setIsConnected = (connected) => { this.isConnected = connected; this.updateHook(); }
  setConnection = (connection) => { this.connection = connection; this.updateHook(); }
  setServerUrl = (url) => { this.serverUrl = url; this.updateHook(); }
  setBufferedMessages = (messages) => { this.bufferedMessages = messages; this.updateHook(); }
  setChatContents = (content) => { this.chatContents = content; this.updateHook(); }
  setChatInputText = (text) => { this.chatInputText = text; this.updateHook(); }
  addRefreshCallback = (callback) => { this.refreshCallbacks.push(callback); }


  getId = () => { return this.id; }
  getName = () => { return this.name; }
  getIsConnected = () => { return this.isConnected; }
  getConnection = () => { return this.connection; }
  getServerUrl = () => { return this.serverUrl; }
  getBufferedMessages = () => { return this.bufferedMessages; }
  getChatContents = () => { return this.chatContents; }
  getChatInputText = () => { return this.chatInputText; }
  getReceiveInputCallback = () => { return this.onReceiveInput; }
  getChatInputChangeCallable = () => { return this.onReceiveInput; }
  getSendMessageCallable = () => { return this.sendMessage; }
  getConnectCallable = () => { return this.connect; }
  getDisconnectCallable = () => { return this.disconnect; }

  connect = (serverUrl) => {
    let url = serverUrl !== null ? this.getServerUrl() : serverUrl;
    let connection = new WebSocket(url);
    connection.onopen = this.onConnectToServer;
    connection.onclose = this.onDisconnectFromServer;
    connection.onmessage = this.receiveChatFromServer;
    this.setConnection(connection);
    this.setIsConnected(true);
  }

  disconnect = () => {
    this.getConnection().close();
    this.setIsConnected(false);
  }

  onReceiveInput = (event) => {
    console.log(event);
    this.addToChatContents(event.name, event.message);
  }

  onConnectToServer = (e) => {
    this.setIsConnected(true);
    this.getConnection().send(JSON.stringify({
      type: 'connect',
      id: this.getId(),
      name: this.getName()
    }));
    this.addToChatContents("System", "Connected");
    if(this.getBufferedMessages().length > 0) {
      this.addToChatContents("System","Sending buffered messages");
      this.getBufferedMessages().forEach( (packet) => {
        this.sendChatToServer(packet.name, packet.message);
      });
      this.setBufferedMessages([]);
    }
  }

  onDisconnectFromServer = () => {
    this.setIsConnected(false);
    this.getConnection().close();
    this.addToChatContents("System", "Disconnected, messages will be buffered.");
  }

  addToChatContents = (name, message) => {
    this.setChatContents(this.getChatContents() + '\n' + name + ': ' + message)
  }

  receiveChatFromServer = (packet) => {
    let decodedJson = JSON.parse(packet.data);
    this.addToChatContents(decodedJson.name,decodedJson.message);
    console.log(packet);
  }

  sendChatToServer = (name, message) => {
    let packet = {
      type: 'message',
      name: name,
      message: message
    };
    if(this.getIsConnected()) {
      this.getConnection().send(JSON.stringify(packet));
    } else {
      this.getBufferedMessages().push(packet);
    }
    console.log(packet);
  }

  sendMessage = event => {
    let message = this.getChatInputText();
    // console.log(message);
    this.setChatInputText('');
    this.addToChatContents(this.getName(), message);
    this.sendChatToServer(this.getName(), message);
  }

}

export default ChatApp