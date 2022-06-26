import React from "react";
import ReactDOM from "react-dom";
import Settings from "./Settings";
import Homepage from "../../homepage/Homepage";
import configFile from '../../../config.json';
import './Settings.css';

const currentGroupData = JSON.parse(localStorage.getItem('currentGroupData'));

var requestedUsers = [];

try {
  if (currentGroupData.requestedUsers.length === 0) {
    requestedUsers.push(
      <li>Nobody yet has made request :(</li>
    );
  } else {
    for (let i = 0; i <= currentGroupData.requestedUsers.length - 1; i++) {
      requestedUsers.push(
        <div key={i} className='user'>
          <p className='username'>{currentGroupData.requestedUsers[i]}</p>

          <button className='allow-user' onClick={() => allowUser(i)}>✓</button>
        </div>
      );
    }
  }
} catch (err) {
  console.log(err);
}

async function allowUser(user) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      groupName: currentGroupData.groupName,
      username: currentGroupData.requestedUsers[user]
    })
  }

  const res = await fetch(`${configFile.serverURL}/allow-user`, options);
  const data = await res.json();

  console.log(data);
}

function back() {
  ReactDOM.render(
    <Homepage frame={<Settings />} />, document.getElementById('root')
  );
}

export default class RequestedUsers extends React.Component {
  render() {
    return (
      <div className='group-members-container'>
        <h1>Users who requested are: </h1>

        <ul>
          {requestedUsers}
        </ul>

        <div className='back-btn-container'>
          <button className='back-btn' onClick={back}>Back</button>
        </div>
      </div>
    );
  }
}
