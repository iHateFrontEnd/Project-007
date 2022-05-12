import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Scrollbars from 'react-custom-scrollbars-2';
import StatusBar from '../status-bar/GroupStatusBar';
import renderGroupChat from '../homepage/renderGroupChat';
import { io } from 'socket.io-client';
import Homepage from '../homepage/Homepage';
import configFile from '../../config.json';
import './GroupChat.css';

export default function GroupChat(msgArr) {
  //updating the chat
  const sendMsg = async () => {
    const currentGroupData = JSON.parse(localStorage.getItem('currentGroupData'));
    const user = JSON.parse(localStorage.getItem('user'));
    var typedMsg = document.getElementById('msg').value;
    const msg = JSON.parse(sessionStorage.getItem('rawMsg'));

    const socket = io(configFile.websocketServerURL);

    socket.emit('send-msg', msg, user.username, typedMsg, currentGroupData.groupName);

    //updating the messages
    socket.on('recive-msg', (msg) => {
      sessionStorage.setItem('rawMsg', JSON.stringify(msg));

      const groupData = JSON.parse(localStorage.getItem('chatData'));

      for (let i = 0; i <= groupData.groups.length; i++) {
        if (groupData.groups[i] === currentGroupData.groupName) {
          renderGroupChat(i, 'storage');
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

  return (
    <div className='groupChat' id='groupChat'>
      {StatusBar()}

      <div className="chat" id='chat'>
        {msgArr}
      </div>

      <div className="enterMsg">
        <input placeholder='Type a message' type="text" id="msg" className="msg" />

        <button onClick={sendMsg} className='sendMsg'>Send</button>
      </div>
    </div>
  );
}
