import React from 'react';
import Picker from './Picker';
import Chat from './chat/Chat';

class App extends React.Component {
  onChange = event => {
    console.log(event.target.value);
  }

  sendMessage = event => {
    console.log(this.state.chatInputText);
  }

  sendEvent = () => {
    let e = new Event('receiveInput');
    e.name = 'Joe';
    e.message = 'Hi';
    window.dispatchEvent(e);
  }
  state={
    currentApp: null,
    chatInputText: ''
  }
  render() {
    return (
      <div className="container">
        <Picker
          name = "chosenApp"
          items = {[{
            name: "chatApp",
            value: "chatApp",
            label: "Chat App"
          },
          {
            name: "otherApp",
            value: "otherApp",
            label: "Other App"
          }]}
          onChange = {this.onChange}
          />
        <Chat
          name = "Bob"
          serverUrl = "ws://localhost:8080"
          />
        <button
          onClick = {this.sendEvent}
        >Receive Event</button>
      </div>
    )
  }
}

export default App;
