import React from 'react';

function ChatInput(props)
{
  return (
    <div>
      <input
        name={props.name}
        className="code"
        value={props.value}
        onChange={props.onChange}
        onKeyUp={event => {if(event.key === "Enter") props.sendMessage()}}
        />
      <button
        onClick={props.sendMessage}
        >Send Message</button>
    </div>
  )
}

export default ChatInput
