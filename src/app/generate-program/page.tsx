'use client';

import React from 'react';
import { useState } from 'react';

const GenerateProgramPage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);

  return <div>GenerateProgramPage</div>;
};

export default GenerateProgramPage;
