import React from 'react';
import StatusBar from '../status-bar/GroupStatusBar';
import renderChat from '../../renderChat';
import { io } from 'socket.io-client';
import configFile from '../../config.json';
import './GroupChat.css';

function sendMsg() {
  const currentGroupData = JSON.parse(localStorage.getItem('currentGroupData'));
  const user = JSON.parse(localStorage.getItem('user'));
  var typedMsg = document.getElementById('msg').value;
  const msg = JSON.parse(sessionStorage.getItem('rawMsg'));

  const socket = io(configFile.websocketServerURL);

  socket.emit('send-msg-groups', msg, user.username, typedMsg, currentGroupData.groupName, 'groups');

  //updating the messages
  socket.on('recive-msg-groups', (msg) => {
    sessionStorage.setItem('rawMsg', JSON.stringify(msg));

    const chatData = JSON.parse(localStorage.getItem('chatData'));

    for (let i = 0; i <= chatData.groups.length; i++) {
      if (chatData.groups[i] === currentGroupData.groupName) {
        renderChat(i, 'storage', 'groups');
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

export default class GroupChat extends React.Component {
  render() {
    return (
      <div className='groupChat' id='groupChat'>
        <StatusBar />

        <div className="chat" id='chat'>
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