import React from 'react';
import ReactDOM from 'react-dom';
import configFile from './config.json';
import Homepage from './components/homepage/Homepage';
import DmChat from './components/dm-chat/DmChat';
import GroupChat from './components/group-chat/GroupChat';

function trimMsg(data, chatType) {
  var stringMsg = JSON.stringify(data);

  var trimedMsg = stringMsg.replaceAll('"', '');
  trimedMsg = trimedMsg.replaceAll('[', '');
  trimedMsg = trimedMsg.replaceAll(']', '');
  trimedMsg = trimedMsg.replaceAll('{', '');
  trimedMsg = trimedMsg.replaceAll(':', ' : ');

  var msgArr = [];
  var rawMsg = [];

  rawMsg.push(trimedMsg.split('},'));

  //removing } (this is the last charecter of all the msg's)
  rawMsg[0][rawMsg[0].length - 1] = rawMsg[0][rawMsg[0].length - 1].slice(0, -1) + '';

  if (chatType === 'groups') sessionStorage.setItem('rawMsg', stringMsg);
  else if (chatType === 'dm') sessionStorage.setItem('dmRawMsg', stringMsg);

  for (let i = 0; i <= rawMsg[0].length; i++) {
    msgArr.push(
      <p key={i}>
        {rawMsg[0][i]}
      </p>
    );
  }

  if (chatType === 'groups') {
    ReactDOM.render(
      <Homepage frame={<GroupChat chat={msgArr} />} />, document.getElementById('root')
    );
  } else if (chatType === 'dm') {
    ReactDOM.render(
      <Homepage frame={<DmChat chat={msgArr} />} />, document.getElementById('root')
    );
  }
}

export default async function renderChat(index, toUse, chatType) {
  const renderGroupChat = () => {
    const toUseNetwork = async () => {
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

      const res = await fetch(`${configFile.serverURL}/load-chat-data`, options);
      const data = await res.json();

      await localStorage.setItem('currentGroupData', JSON.stringify({
        requestedUsers: data.requestedUsers,
        permittedUsers: data.permittedUsers,
        groupName: data.groupName
      }));

      trimMsg(data.chat, 'groups');
    }

    if (toUse === 'network') toUseNetwork();
    else if (toUse === 'storage') {
      const rawMsg = JSON.parse(sessionStorage.getItem('rawMsg'));

      trimMsg(rawMsg, 'groups');
    }
  }

  const renderDmChat = () => {
    const toUseNetwork = async () => {
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
          fUsername: chatData.friends[index]
        })
      }

      const res = await fetch(`${configFile.serverURL}/load-chat-data`, options);
      const data = await res.json();

      localStorage.setItem('currentDmData', JSON.stringify({
        chattingWith: data.fUsername
      }));

      trimMsg(data.chat, 'dm');
    }

    if (toUse === 'network') toUseNetwork();
    else if (toUse === 'storage') {
      const dmRawMsg = JSON.parse(sessionStorage.getItem('dmRawMsg'));

      trimMsg(dmRawMsg, 'dm');
    }
  }

  if (chatType === 'groups') renderGroupChat();
  else if (chatType === 'dm') renderDmChat();
}
