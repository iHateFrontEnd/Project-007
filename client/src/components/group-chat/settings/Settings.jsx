import React from 'react';
import ReactDOM from 'react-dom';
import ViewMembers from './ViewMembers';
import RequestedUsers from './RequestedUsers';
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

function renderRequestedUsers() {
  ReactDOM.render(
    <Homepage frame={<RequestedUsers />} />, document.getElementById('root')
  );
}

export default class Settings extends React.Component {
  render() {
    return (
      <div className='settings' id='settings'>
        <h1>◦ Mess with some group settings!</h1>

        <h2 className='groupName-heading'>➫ Have a look at the users who want to be a part of this group: </h2>
        <button className='settings-btn' onClick={renderRequestedUsers}>Check it out!</button>

        <h2 className='groupName-heading'>➫ Check out the members of this group: </h2>
        <button className='settings-btn' onClick={renderViewMembers}>Check it out!</button>

        <h2 className='groupName-heading'>➫ Remove some people from the group (for fun)</h2>
        <button className='settings-btn' onClick={renderRemovePeople}>Remove people</button>
      </div>
    );
  }
}
