// pages/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  const startChat = () => {
    if (name) {
      router.push(`/chat?name=${name}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Enter your name to start chatting</h1>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      <button onClick={startChat}>Start Chat</button>
    </div>
  );
}
