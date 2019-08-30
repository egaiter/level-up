import React from 'react';
import Chat from './chat/Chat';

class App extends React.Component {
  state={
    currentApp: null,
  }
  render() {
    return (
      <div className="container">
        <Chat
          name = "Grehg"
          serverUrl = "ws://levelup.madwire.network:8080"
          />
      </div>
    )
  }
}

export default App;
