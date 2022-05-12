import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import configFile from '../../config.json';
import Homepage from './Homepage';
import GroupChat from '../group-chat/GroupChat';

function trimMsg(data) {
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

  sessionStorage.setItem('rawMsg', stringMsg);

  for (let i = 0; i <= rawMsg[0].length; i++) {
    msgArr.push(
      <p>
        {rawMsg[0][i]}
      </p>
    );
  }

  ReactDOM.render(
    <Homepage frame={GroupChat(msgArr)} />, document.getElementById('root')
  );

}

export default async function renderGroupChat(groupIndex, toUse) {
  const toUseNetwork = async () => {
    const chatData = JSON.parse(localStorage.getItem('chatData'));

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        toLoad: 'group',
        groupName: chatData.groups[groupIndex]
      })
    }

    const res = await fetch(`${configFile.serverURL}/load-chat-data`, options);
    const data = await res.json();

    await localStorage.setItem('currentGroupData', JSON.stringify({
      requestedUsers: data.requestedUsers,
      permittedUsers: data.permittedUsers,
      groupName: data.groupName
    }));

    trimMsg(data.chat);
  }

  if (toUse === 'network') toUseNetwork();
  else if (toUse === 'storage') {
    const rawMsg = JSON.parse(sessionStorage.getItem('rawMsg'));

    trimMsg(rawMsg);
  }
}