import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './components/Login';
import Chat from './components/Chat';
import ContactList from './components/ContactList';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
const socket = io(SOCKET_URL);

export default function App(){
  const [username, setUsername] = useState(null);
  const [room, setRoom] = useState('global');

  useEffect(() => {
    socket.on('connect', () => console.log('conectado ao socket', socket.id));
    socket.on('users', (list) => console.log('users', list));
    return () => socket.off();
  }, []);

  if(!username) return <Login onLogin={(name)=>{ setUsername(name); socket.emit('login', name); }} />

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>WhatsZap</h2>
        <ContactList onSelectRoom={(r)=> setRoom(r)} username={username} />
      </aside>
      <main className="main">
        <Chat socket={socket} username={username} roomId={room} />
      </main>
    </div>
  );
}
