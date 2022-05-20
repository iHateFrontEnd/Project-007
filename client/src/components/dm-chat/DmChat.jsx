import React from 'react';
import { io } from 'socket.io-client';
import DmChatStatusBar from '../status-bar/DmStatusBar';
import './DmChat.css';
import configFile from '../../config.json';
import renderChat from '../../renderChat';

function sendMsg() {
  const user = JSON.parse(localStorage.getItem('user'));
  const currentDmData = JSON.parse(localStorage.getItem('currentDmData'));
  const chatdata = JSON.parse(localStorage.getItem('chatData'));
  const typedMsg = document.getElementById('msg').value;

  const socket = io(configFile.websocketServerURL);

  socket.emit('send-msg-dm', typedMsg, user.username, currentDmData.chattingWith);

  socket.on('recive-msg-dm', (msg) => {
    sessionStorage.setItem('dmRawMsg', JSON.stringify(msg));

    for (let i = 0; i <= chatdata.friends.length; i++) {
      if (chatdata.friends[i] === currentDmData.chattingWith) {
        renderChat(i, 'storage', 'dm');
        break;
      }
    }

    //scrolling the bottom of the div
    var chatDiv = document.getElementById('chat');
    chatDiv.scrollTop = chatDiv.scrollHeight;
  });

  //clearing the msg input
  document.getElementById('msg').value = '';
}

export default class DmChat extends React.Component {
  render() {
    return (
      <div className='dm-chat-container'>
        {<DmChatStatusBar />}

        <div className='chat' id='chat'>
          {this.props.chat}
        </div>

        <div className="enterMsg">
          <input placeholder='Type a message' type="text" id="msg" className="msg" />

          <button onClick={sendMsg} className='sendMsg'>Send</button>
        </div>
      </div>
    );
  }
}