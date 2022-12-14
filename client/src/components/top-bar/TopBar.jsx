import React from 'react';
import { createRoot } from 'react-dom/client';
import Login from '../login/Login';
import Profile from '../../pages/profile/Profile';
import Requests from '../../pages/requests/Requests';
import './TopBar.css';

const root = createRoot(document.getElementById('root'));

function signOut() {
  localStorage.clear();
  sessionStorage.clear();

  root.render(<Login />);
}

export default class TopBar extends React.Component {
  render() {
    return (
      <div className="topBar">
        <button className='topBarBtns' onClick={signOut}>Sign out</button>
        <button className='topBarBtns' onClick={() => root.render(<Requests />)}>Incoming friend requests</button>
        <button className='topBarBtns' onClick={() => root.render(<Profile />)}>Profile</button>
      </div>
    );
  }
}
