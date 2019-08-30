import React, { useState } from 'react';
import './ChatBox.css';

function ChatBox(props) {
  return (
    <div className="chatContainer">
      <div className="chatBox"><pre>{props.chatContents}</pre></div>
    </div>
  );
}

export default ChatBox
