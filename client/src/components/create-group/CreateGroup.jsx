import React, { useState } from 'react';
import configFile from '../../config.json';
import { createRoot } from 'react-dom/client';
import Homepage from '../homepage/Homepage';
import Logo from '../homepage/Logo';
import ClipLoader from 'react-spinners/ClipLoader';
import '../../App.css';

var chatData = JSON.parse(localStorage.getItem('chatData'));

async function saveGroup() {
    //posting data to server to create group 
    var user = JSON.parse(localStorage.getItem('user'));
    const groupName = document.getElementById('groupName').value.replaceAll(' ', '-');
    const trimedGroupName = groupName.replaceAll(' ', '-');

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            groupName: trimedGroupName,
            username: user.username
        })
    }

   fetch(`${configFile.serverURL}/create-group`, options);

    //saving group to local storage
    chatData.groups.push(groupName);
    localStorage.setItem('chatData', JSON.stringify(chatData));

    const root = createRoot(document.getElementById('root'));
    root.render(<Homepage frame={Logo} />);
}

export default function CreateGroup() {
    return (
        <div className='createGroup' id='createGroup'>
            <>
                <h1>Enter your group name: </h1>

                <br />
                <br />

                <input className='concInfoInps' id='groupName' placeholder='Enter group name' required />

                <br />
                <br />
                <br />

                <button className='loginBtn' onClick={() => saveGroup()}>Create</button>
            </>
        </div >
    );
}