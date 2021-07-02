import React from 'react';
import ChatInput from './ChatInput';
import ChatBox from './ChatBox';
import ChatApp from './ChatApp';
import UUIDV1 from 'uuid/v1';

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    let app = new ChatApp(this.checkPixel);
    app.setId(UUIDV1());
    app.setServerUrl(props.serverUrl);
    app.setName(props.name);
    app.addRefreshCallback(this.refresh);
    this.state = {
      app: app,
      refresh: 0,
      pixels: null
    };
  }

  componentDidMount() {
    this.state.app.connect();
    this.loadCanvas();
  }

  componentWillUnmount() {
    this.state.app.disconnect();
  }

  loadCanvas = () => {
    let width = 200;
    let height = 200;
    let canvas = document.getElementById('theCanvas');
    canvas.width = width;
    canvas.height = height;
    let context = canvas.getContext('2d');
    this.setState({
      canvas: canvas,
      context: context,
      width: width,
      height: height
    });
    console.log(canvas);
  }

  checkPixel = (message) => {
    console.log(message);
    if(message.indexOf('pixel:') === 0) {
      let width = this.state.width;
      let height = this.state.height;
      let pixelData = JSON.parse(message.replace('pixel:',''));
      if (pixelData.x < 0 || pixelData.x > this.state.height-1 || pixelData.y < 0 || pixelData.y > this.state.height-1) {
        console.log('oops');
        return;
      }
      console.log('not oops');
      let imageData = this.state.pixels;
      let r = parseInt(pixelData.r);
      let g = parseInt(pixelData.g);
      let b = parseInt(pixelData.b);
      let ctx = this.state.context;
      ctx.fillStyle = "rgba("+r+","+g+","+b+",1)";
      ctx.fillRect( pixelData.x, pixelData.y, 1, 1 );
    }
  }

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

export default Canvas
