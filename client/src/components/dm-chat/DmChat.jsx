import React, { useState } from 'react';
import { io } from 'socket.io-client';
import DmChatStatusBar from '../status-bar/DmStatusBar';
import './DmChat.css';
import configFile from '../../config.json';
import renderChat from '../../renderChat';

const user = JSON.parse(localStorage.getItem('user'));
const currentDmData = JSON.parse(localStorage.getItem('currentDmData'));
const chatdata = JSON.parse(localStorage.getItem('chatData'));

function sendMsg(setChat, socket) {
  const typedMsg = document.getElementById('msg').value;

  socket.emit('send-msg-dm', typedMsg, user.username, currentDmData.chattingWith);

  updateChat(socket, setChat);

  //clearing the msg input
  document.getElementById('msg').value = '';
}

//updating chat
function updateChat(socket, setChat) {
  socket.on('recive-msg-dm', (msg) => {
    sessionStorage.setItem('dmRawMsg', JSON.stringify(msg));

    for (let i = 0; i <= chatdata.friends.length; i++) {
      if (chatdata.friends[i] === currentDmData.chattingWith) {
        renderChat(i, 'storage', 'dm', setChat);
        break;
      }
    }

    //scrolling the bottom of the div
    var chatDiv = document.getElementById('chat');
    chatDiv.scrollTop = chatDiv.scrollHeight;
  });
}

export default function DmChat(props) {
  const [chat, setChat] = useState(props.chat);

  const socket = io(configFile.websocketServerURL);

  updateChat(socket, setChat);

  const currentDmData = JSON.parse(localStorage.getItem('currentDmData'));

  return (
    <div className='dm-chat-container'>
      <DmChatStatusBar fUsername={currentDmData.chattingWith} />

      <div className='chat' id='chat'>
        {chat}
      </div>

      <div className="enterMsg">
        <input placeholder='Type a message' type="text" id="msg" className="msg" />

        <button onClick={() => { sendMsg(setChat, socket) }} className='sendMsg'>Send</button>
      </div>
    </div>
  );
}