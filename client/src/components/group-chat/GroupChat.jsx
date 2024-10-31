import React, { useState, useEffect, useRef } from 'react';
import renderChat from '../../renderChat';
import GroupStatusBar from '../status-bar/GroupStatusBar';
import { io } from 'socket.io-client';
import configFile from '../../config.json';
import './GroupChat.css';

const user = JSON.parse(localStorage.getItem('user'));
const chatData = JSON.parse(localStorage.getItem('chatData'));

function sendMsg(setChat, socket) {
  const currentGroupData = JSON.parse(localStorage.getItem('currentGroupData'));

  var typedMsg = document.getElementById('msg').value;
  const msg = JSON.parse(sessionStorage.getItem('rawMsg'));

  socket.emit('send-msg-groups', msg, user.username, typedMsg, currentGroupData.groupName, 'groups');

  updateChat(setChat, socket);

  // Clear the message input
  document.getElementById('msg').value = '';
}

function updateChat(setChat, socket) {
  const currentGroupData = JSON.parse(localStorage.getItem('currentGroupData'));

  // Listening for incoming messages
  socket.on('recive-msg-groups', (msg) => {
    sessionStorage.setItem('rawMsg', JSON.stringify(msg));

    for (let i = 0; i <= chatData.groups.length; i++) {
      if (chatData.groups[i] === currentGroupData.groupName) {
        renderChat(i, 'storage', 'groups', setChat, msg);
        break;
      }
    }
  });
}

export default function GroupChat(props) {
  const [chat, setChat] = useState(props.chat);
  const chatEndRef = useRef(null);  // Ref to scroll to the end
  const socket = io(configFile.websocketServerURL);
  const currentGroupData = JSON.parse(localStorage.getItem('currentGroupData'));

  // Update chat messages
  useEffect(() => {
    updateChat(setChat, socket);
  }, [socket]);

  // Scroll to bottom when chat updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);  // This will trigger every time chat updates

  return (
    <div className='groupChat' id='groupChat'>
      <GroupStatusBar groupName={currentGroupData.groupName} />

      <div className="chat" id='chat' style={{ overflowY: 'auto', height: '62vh' }}>
        {chat}
        {/* This empty div acts as the scroll target */}
        <div ref={chatEndRef} />
      </div>

      <div className="enterMsg">
        <input placeholder='Type a message' type="text" id="msg" className="msg" />

        <button onClick={() => { sendMsg(setChat, socket) }} className='sendMsg'>Send</button>
      </div>
    </div>
  );
}
