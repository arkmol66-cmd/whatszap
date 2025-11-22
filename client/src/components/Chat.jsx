import React, { useEffect, useState, useRef } from 'react';

export default function Chat({ socket, username, roomId }){
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const ref = useRef();

  useEffect(()=>{
    if(!socket) return;
    socket.emit('join_room', roomId);
    socket.emit('get_history', roomId, (history) => setMessages(history || []));
    const handler = (msg) => setMessages(prev => [...prev, msg]);
    socket.on('new_message', handler);
    return () => {
      socket.off('new_message', handler);
      socket.emit('leave_room', roomId);
    }
  }, [roomId]);

  const send = () => {
    if(!text.trim()) return;
    socket.emit('send_message', { roomId, message: text.trim(), from: username });
    setText('');
  };

  useEffect(()=> {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat">
      <h3>Sala: {roomId}</h3>
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.from === username ? 'me' : ''}`}>
            <strong>{m.from}</strong>
            <p>{m.message}</p>
            <small>{new Date(m.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
        <div ref={ref} />
      </div>

      <div className="composer">
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=> e.key === 'Enter' && send()} />
        <button onClick={send}>Enviar</button>
      </div>
    </div>
  );
}
