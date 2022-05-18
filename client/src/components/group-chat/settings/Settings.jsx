import React from 'react';
import ReactDOM from 'react-dom';
import ViewMembers from './ViewMembers';
import RemovePeople from './RemovePeople';
import Homepage from '../../homepage/Homepage';
import configFile from '../../../config.json';
import './Settings.css';

function renderRemovePeople() {
  ReactDOM.render(
    <Homepage frame={<RemovePeople />} />, document.getElementById('root')
  );
}

function renderViewMembers() {
  ReactDOM.render(
    <Homepage frame={<ViewMembers />} />, document.getElementById('root')
  );
}

async function changeGroupName() {
  const user = JSON.parse(localStorage.getItem('user'));
  var currentGroupData = JSON.parse(localStorage.getItem('currentGroupData'));
  const groupName = document.getElementById('groupName').value;

  if (groupName != '') {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newGroupName: groupName,
        groupName: currentGroupData.groupName,
        userIndex: user.userIndex
      })
    }

    const res = await fetch(`${configFile.serverURL}/change-group-name`, options);
    const data = await res.json();

    localStorage.setItem('currentGroupData', JSON.stringify(data.currentGroupData));
    localStorage.setItem('chatData', JSON.stringify(data.chatData));

    window.location.reload();

  } else {
    alert('Please enter a proper group name');
  }
}

export default class Settings extends React.Component {
  render() {
    return (
      <div className='settings' id='settings'>
        <h1>◦ Mess with some group settings!</h1>

        <h2 className='groupName-heading'>➫ Check out the members of this group: </h2>
        <button className='settings-btn' onClick={renderViewMembers}>Check it out!</button>

        <div className='edit-group-name-container'>
          <h2 className='groupName-heading'>➫ Change the group name:</h2>

          <input className='group-name' id='groupName' placeholder='Enter new group name' />

          <br />
          <br />
          <br />

          <button className='edit-group-name-btn' onClick={changeGroupName}>Change</button>
        </div>
        <h2 className='groupName-heading'>➫ Remove some people from the group (for fun)</h2>
        <button className='settings-btn' onClick={renderRemovePeople}>Remove people</button>
      </div>
    );
  }
}