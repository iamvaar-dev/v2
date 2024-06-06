// pages/chat.js
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export default function Chat() {
  const router = useRouter();
  const { name } = router.query;
  const [peer, setPeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('Waiting for a peer...');
  const messageRef = useRef();

  useEffect(() => {
    if (!name) return;

    socket.emit('join', { name });

    socket.on('peer', (peer) => {
      setPeer(peer);
      setStatus('Connected');
    });

    socket.on('waiting', () => {
      setStatus('Waiting for a peer...');
    });

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('peer-disconnected', () => {
      setPeer(null);
      setStatus('Your peer has disconnected. Waiting for a new peer...');
    });

    return () => {
      socket.disconnect();
    };
  }, [name]);

  const sendMessage = () => {
    const message = messageRef.current.value;
    if (message && peer) {
      const msg = { name, message, peerId: peer.id };
      socket.emit('message', msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
      messageRef.current.value = '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Chatting as {name}</h1>
      <p>{status}</p>
      <div style={{ border: '1px solid black', width: '300px', height: '400px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div key={index}><strong>{msg.name}:</strong> {msg.message}</div>
        ))}
      </div>
      <input type="text" ref={messageRef} placeholder="Type a message" />
      <button onClick={sendMessage} disabled={!peer}>Send</button>
    </div>
  );
}
