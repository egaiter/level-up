import React from 'react';
import ChatInput from './ChatInput';
import ChatBox from './ChatBox';
import UUIDV1 from 'uuid/v1';

class Chat extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        isConnected: false,
        serverUrl: props.serverUrl,
        id: UUIDV1(),
        chatInputText: '',
        chatContents: '',
        bufferedMessages: [],
        name: props.name
      };
  }

  componentDidMount() {
    this.connectToServer();
    window.addEventListener('receiveInput',this.onReceiveInput);
  }

  componentWillUnmount() {
    this.state.connection.close();
    this.setState({
        connection: null
    })
    window.removeEventListener('receiveInput',this.onReceiveInput);
  }

  connectToServer = (serverUrl) => {
    let url = serverUrl !== null ? this.state.serverUrl : serverUrl;
    let conn = new WebSocket(url);
    conn.onopen = this.onConnectToServer;
    conn.onclose = this.onDisconnectFromServer;
    conn.onmessage = this.receiveChatFromServer;
    this.setState({
        connection: conn,
        serverUrl: url
    })
  }

  onReceiveInput = (event) => {
    console.log(this);
    this.addToChatContents(event.name, event.message);
  }

  onConnectToServer = (e) => {
    this.setState({
      isConnected: true
    })
    console.log(e);
    this.state.connection.send(JSON.stringify({
        type: 'connect',
        id: this.state.id
    }))
    this.addToChatContents("System","Connected");
    if (this.state.bufferedMessages.length > 0) {
      this.addToChatContents("System","Sending buffered messages");
      this.state.bufferedMessages.forEach(packet => {
        console.log(packet);
        this.sendChatToServer(packet.name, packet.message);
      })
      this.setState({
        bufferedMessages: []
      });
    }
  }

  onDisconnectFromServer = () => {
    this.setState({
      isConnected: false
    })
    this.addToChatContents("System","Disconnected, messages will be buffered.");
  }

  onChatInputChange = event => {
    this.setState({
      chatInputText: event.target.value
    });
  }

  addToChatContents = (name, message) => {
    this.setState({
      chatContents: this.state.chatContents+'\n'+name+': '+message
    })
  }

  receiveChatFromServer = (packet) => {
      console.log(packet);
      let decodedPacket = JSON.parse(packet.data);
      this.addToChatContents(decodedPacket.name,decodedPacket.message);
  }

  sendChatToServer = (name, message) => {
      let packet = {
        type: 'message',
        name: name,
        message: message
      };
      if (this.state.isConnected) {
          this.state.connection.send(JSON.stringify(packet));
      } else {
          this.state.bufferedMessages.push(packet);
      }
  }

  sendMessage = event => {
    let message = this.state.chatInputText;
    // console.log(message);
    this.setState({
      chatInputText: ''
    });
    this.addToChatContents(this.state.name,message);
    this.sendChatToServer(this.state.name,message);
  }

  onNameChange = event => {
      this.setState({
        name: event.target.value
      });
  }

  render() {
    let connectButton = this.state.isConnected ? null : (
        <button
        onClick = {this.connectToServer}>Conntect to Server</button>
    );
    return (
      <div>
        <input
          value={this.state.name}
          onChange={this.onNameChange}
          />
        <ChatBox
          chatContents={this.state.chatContents}
          />
        <ChatInput
          name="bob"
          value={this.state.chatInputText}
          onChange={this.onChatInputChange}
          sendMessage={this.sendMessage}
          />
        {connectButton}
      </div>
    )
  }
}

export default Chat
