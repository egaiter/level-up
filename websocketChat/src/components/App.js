import React, { Component } from 'react';
import Chat from './chat/Chat';

class App extends React.Component {
  state={
    currentApp: null,
  }
  render() {
    return (
      <div className="container">
        <Chat
          name = "Bob"
          serverUrl = "ws://localhost:8080"
          />
      </div>
    )
  }
}

export default App;
