import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Homepage from './components/homepage/Homepage';
import GroupChat from './components/group-chat/GroupChat';
import DmChat from './components/dm-chat/DmChat';

export default function trimMsg(data, chatType, setChat) {
  console.log(data)

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

  if (chatType === 'dm') {
    if (setChat === null) {
      ReactDOM.render(
        <Homepage frame={<DmChat chat={msgArr} />} />, document.getElementById('root')
      );
    } else {
      setChat(<p>Hello world</p>);
    }
  } else {
    if (setChat === null) {
      ReactDOM.render(
        <Homepage frame={<GroupChat chat={msgArr} />} />, document.getElementById('root')
      );
    } else {
      setChat(msgArr);
    }
  }
}
