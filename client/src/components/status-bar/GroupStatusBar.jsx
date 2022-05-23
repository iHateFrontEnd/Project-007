import React from 'react';
import ReactDOM from 'react-dom';
import AddPeople from '../group-chat/AddPeople';
import Homepage from '../homepage/Homepage';
import Settings from '../group-chat/settings/Settings';
import configFile from '../../config.json';
import './StatusBar.css';

const currentGroupData = JSON.parse(localStorage.getItem('currentGroupData'));

function addPeople() {
  ReactDOM.render(
    <Homepage frame={<AddPeople />} />, document.getElementById('root')
  );
}

function leaveGroup() {
  const currentGroupData = JSON.parse(localStorage.getItem('currentGroupData'));
  const user = JSON.parse(localStorage.getItem('user'));

  //changing the users.json file using server
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      groupName: currentGroupData.groupName,
      userIndex: user.userIndex,
      username: user.username
    })
  }

  fetch(`${configFile.serverURL}/leave-group`, options);

  //changing chatData in localStorage()
  var chatData = JSON.parse(localStorage.getItem('chatData'));

  //searching for groups index
  var groupIndex = -1;

  for (let i = 0; i <= chatData.groups.length; i++) {
    groupIndex++;

    if (chatData.groups[i] === currentGroupData.groupName) break;
  }

  chatData.groups.splice(groupIndex, 1);
  localStorage.setItem('chatData', JSON.stringify(chatData));

  window.location.reload();
}

function renderSettings() {
  ReactDOM.render(
    <Homepage frame={<Settings />} />, document.getElementById('root')
  );
}

export default class GroupStatusBar extends React.Component {
  render() {
    return (
      <div className='groupStatusBar'>
        <h4>{currentGroupData.groupName}</h4>

        <button className='statusBarBtns' onClick={addPeople}>Add people</button>

        <button className='statusBarBtns' onClick={leaveGroup}>Leave</button>

        <button className='statusBarBtns' onClick={renderSettings}>Settings</button>
      </div>
    );
  }
}