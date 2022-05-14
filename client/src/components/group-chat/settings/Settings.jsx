import React from 'react';
import Popup from 'reactjs-popup';
import './Settings.css';

export default function Settings() {
  const currentGroupData = JSON.parse(localStorage.getItem('currentGroupData'));

  const renderViewMembers = () => {
    //render view members
  }

  const changeGroupName = () => {
    //make request to server and change the name of the group
  }

  const renderRemovePeople = () => {
    //render remove people
  }

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