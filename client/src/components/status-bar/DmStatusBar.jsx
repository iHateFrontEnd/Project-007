import React from 'react';
import configFile from '../../config.json';
import './StatusBar.css';

const currentDmData = JSON.parse(localStorage.getItem('currentDmData'));
var chatData = JSON.parse(localStorage.getItem('chatData'));
const user = JSON.parse(localStorage.getItem('user'));

function unFriend() {

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: user.username,
      userIndex: user.userIndex,
      fUsername: currentDmData.chattingWith
    })
  }

  fetch(`${configFile.serverURL}/un-friend-user`, options);

  //modifying localStorage
  var userIndex = -1;

  for (let i = 0; i <= chatData.friends.length; i++) {
    userIndex++;

    if (chatData.friends[i] === currentDmData.chattingWith) {
      chatData.friends.splice(i, 1);
      localStorage.setItem('chatData', JSON.stringify(chatData));
      localStorage.removeItem('currentDmData');

      break;
    }
  }

  window.location.reload();
}

export default class DmChatStatusBar extends React.Component {
  render() {
    return (
      <div className='dm-status-bar'>
        <h4>Chatting with: {this.props.fUsername}</h4>

        <button className='statusBarBtns' onClick={unFriend}>un-friend</button>
      </div>
    );
  }
}