import React, { useState, useEffect } from 'react';
import PropagateLoader from 'react-spinners/PropagateLoader';
import renderChat from '../../renderChat';
import GroupStatusBar from '../status-bar/GroupStatusBar';
import { io } from 'socket.io-client';
import trimMsg from '../../trimMsg';
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

  //clearing the msg input
  document.getElementById('msg').value = '';
}

function updateChat(setChat, socket) {
  const currentGroupData = JSON.parse(localStorage.getItem('currentGroupData'));

  //updating the messages
  socket.on('recive-msg-groups', (msg) => {
    sessionStorage.setItem('rawMsg', JSON.stringify(msg));

    for (let i = 0; i <= chatData.groups.length; i++) {
      if (chatData.groups[i] === currentGroupData.groupName) {
        renderChat(i, 'storage', 'groups', setChat);
        break;
      }
    }

    //scrolling the bottom of the div
    var chatDiv = document.getElementById('chat');
    chatDiv.scrollTop = chatDiv.scrollHeight;
  });
}

//fetching the group data
async function getGroupData(setLoading, setChat, index) {
  setLoading(true);

  const chatData = JSON.parse(localStorage.getItem('chatData'));

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      toLoad: 'group',
      groupName: chatData.groups[index]
    })
  }

  const res = await fetch(`${configFile.serverURL}/load-chat`, options);
  const data = await res.json();

  await localStorage.setItem('currentGroupData', JSON.stringify({
    requestedUsers: data.requestedUsers,
    permittedUsers: data.permittedUsers,
    groupName: data.groupName
  }));

  const msg = trimMsg(data.chat, 'groups', null);

  setLoading(false);
  setChat(msg);
}

export default function GroupChat(props) {
  console.log('in funcitn ');

  const [chat, setChat] = useState(props.chat);
  const [loading, setLoading] = useState(false);


  useEffect(() => getGroupData(setLoading, setChat, props.data.index), [props]);

  const currentGroupData = JSON.parse(localStorage.getItem('currentGroupData'));
  const socket = io(configFile.websocketServerURL);

  updateChat(setChat, socket);

  return (
    <>
      {
        loading ?
          <PropagateLoader
            color={"white"}
            loading={loading}
            className="loading"
          />

          :

          <>
            <div className='groupChat' id='groupChat'>

              <GroupStatusBar groupName={currentGroupData.groupName} />

              <div className="chat" id='chat'>
                {chat}
              </div>

              <div className="enterMsg">
                <input placeholder='Type a message' type="text" id="msg" className="msg" />

                <button onClick={() => { sendMsg(setChat, socket) }} className='sendMsg'>Send</button>
              </div>
            </div>
          </>
      }
    </>
  );
}