import React, { useEffect, useState } from 'react';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { io } from 'socket.io-client';
import DmChatStatusBar from '../status-bar/DmStatusBar';
import './DmChat.css';
import configFile from '../../config.json';
import trimMsg from '../../trimMsg';

const user = JSON.parse(localStorage.getItem('user'));

function sendMsg(setChat, socket, chattingWith) {
  const typedMsg = document.getElementById('msg').value;

  socket.emit('send-msg-dm', typedMsg, user.username, chattingWith);

  updateChat(socket, setChat);

  document.getElementById('msg').value = '';
}

//updating chat
async function updateChat(socket, setChat) {
  socket.on('recive-msg-dm', (rawMsg) => {
    sessionStorage.setItem('dmRawMsg', JSON.stringify(rawMsg));

    const msg = trimMsg(rawMsg, 'dm', null);
    setChat(msg);
    
    //scrolling the bottom of the div
    var chatDiv = document.getElementById('chat');
    chatDiv.scrollTop = chatDiv.scrollHeight;
  });
}

async function getData(setLoading, props, setChat) {
  setLoading(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const chatData = JSON.parse(localStorage.getItem('chatData'));

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      toLoad: 'dm',
      username: user.username,
      fUsername: chatData.friends[props.data.index].username,
    })
  }

  const res = await fetch(`${configFile.serverURL}/load-chat`, options);
  const data = await res.json();

  localStorage.setItem('currentDmData', JSON.stringify({
    chattingWith: chatData.friends[props.data.index].username
  }));
  
  const msg = await trimMsg(data.chat, 'dm', null);
  
  setLoading(false);

  setChat(msg);
}

export default function DmChat(props) {
  const [chat, setChat] = useState(props.chat);
  const [loading, setLoading] = useState(false);

  const socket = io(configFile.websocketServerURL);

  const currentDmData = JSON.parse(localStorage.getItem('currentDmData'));

  useEffect(() => {
    getData(setLoading, props, setChat);
  }, []);


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

        <div className='dm-chat-container'>
          <DmChatStatusBar data={currentDmData}/>

          <div className='chat' id='chat'>
            {chat}
          </div>

          <div className="enterMsg">
            <input placeholder='Type a message' type="text" id="msg" className="msg" />

            <button onClick={() => { sendMsg(setChat, socket, currentDmData.chattingWith) }} className='sendMsg'>Send</button>
          </div>
        </div>
      }
    </>
  );
}
