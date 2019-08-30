import React, { useState } from 'react';

function useChatHook(connection) {
  const [websocketConnection, setWebsocketConnection] = useState(connection);
  const [messageProcessor, setMessageProcessor] = useState(() => { });
  return {
    websocketConnection,
    setWebsocketConnection,
    sendChat
  };
}

export default useChatHook;
