import React from 'react';

export default function ContactList({ onSelectRoom, username }){
  const contacts = [
    { id: 'global', name: 'Geral' },
    { id: 'private-1', name: 'Amigos' },
    { id: 'private-2', name: 'Trabalho' }
  ];
  return (
    <div>
      <p>Logado como: <strong>{username}</strong></p>
      <ul className="contacts">
        {contacts.map(c => (
          <li key={c.id}>
            <button onClick={()=> onSelectRoom(c.id)}>{c.name}</button>
        </li>
        ))}
      </ul>
    </div>
  );
}
