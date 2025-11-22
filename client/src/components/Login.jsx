import React, { useState } from 'react';

export default function Login({ onLogin }){
  const [name, setName] = useState('');
  return (
    <div className="login">
      <h2>Entrar no WhatsZap</h2>
      <input placeholder="Seu nome" value={name} onChange={e=>setName(e.target.value)} />
      <button onClick={()=> name.trim() && onLogin(name.trim())}>Entrar</button>
    </div>
  )
}
