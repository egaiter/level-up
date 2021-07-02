import React from 'react';
import ChatInput from './ChatInput';
import ChatBox from './ChatBox';
import ChatApp from './ChatApp';
import UUIDV1 from 'uuid/v1';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    let app = new ChatApp();
    app.setId(UUIDV1());
    app.setServerUrl(props.serverUrl);
    app.setName(props.name);
    app.addRefreshCallback(this.refresh);
    this.state = {
      app: app,
      refresh: 0
    };
  }

  componentDidMount() {
    this.state.app.connect();
  }

  componentWillUnmount() {
    this.state.app.disconnect();
<<<<<<< HEAD
 }
=======
  }
>>>>>>> master

  refresh = () => {
    this.setState({refresh:this.state.refresh+1})
  }
  onNameChange = event => {
    this.state.app.setName(event.target.value);
  }

  onChatInputChange = event => {
    this.state.app.setChatInputText(event.target.value);
  }
  render() {
    let connectButton = this.state.app.getIsConnected() ? (
      <button
        onClick={this.state.app.getDisconnectCallable()}>Disconnect</button>
    ) : (
      <button
        onClick={this.state.app.getConnectCallable()}>Connect to Server</button>
    );
    return (
      <div>
        <input
          value={this.state.app.getName()}
          onChange={this.onNameChange}
        />
        <ChatBox
          chatContents={this.state.app.getChatContents()}
        />
        <ChatInput
          name="bob"
          value={this.state.app.getChatInputText()}
          onChange={this.onChatInputChange}
          sendMessage={this.state.app.getSendMessageCallable()}
        />
        {connectButton}
      </div>
    )
  }
}

export default Chat
