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
  getSendMessageCallable = () => { return this.sendMessage; }
  getConnectCallable = () => { return this.connect; }
  getDisconnectCallable = () => { return this.disconnect; }

  connect = (serverUrl) => {
    let url = serverUrl !== null ? this.getServerUrl() : serverUrl;
    let conn = new WebSocket(url);
    conn.onopen = this.onConnectToServer;
    conn.onclose = this.onDisconnectFromServer;
    conn.onmessage = this.receiveChatFromServer;
    this.setConnection(conn);
    this.setServerUrl(url);
  }

  disconnect = () => {
    this.getConnection().close();
    this.setIsConnected(false);
  }

  onConnectToServer = (e) => {
    this.setIsConnected(true);
    this.getConnection().send(JSON.stringify({
      type: 'connect',
      id: this.getId(),
      name: this.getName()
    }))
    this.addToChatContents("System", "Connected");
    if (this.getBufferedMessages().length > 0) {
      this.addToChatContents("System", "Sending buffered messages");
      this.getBufferedMessages().forEach(packet => {
        this.sendChatToServer(packet.name, packet.message);
      })
      this.setBufferedMessages([]);
    }
  }

  onDisconnectFromServer = () => {
    this.setIsConnected(false);
    this.addToChatContents("System", "Disconnected, messages will be buffered.");
  }

  addToChatContents = (name, message) => {
    this.setChatContents(this.getChatContents() + '\n' + name + ': ' + message)
  }

  receiveChatFromServer = (packet) => {
    let decodedPacket = JSON.parse(packet.data);
    this.addToChatContents(decodedPacket.name, decodedPacket.message);
  }

  sendChatToServer = (name, message) => {
    let packet = {
      type: 'message',
      name: name,
      message: message
    };
    if (this.getIsConnected()) {
      this.getConnection().send(JSON.stringify(packet));
    } else {
      this.getBufferedMessages().push(packet);
    }
  }

  sendMessage = event => {
    let message = this.getChatInputText();
    this.setChatInputText('');
    this.addToChatContents(this.getName(), message);
    this.sendChatToServer(this.getName(), message);
  }

}

export default ChatApp