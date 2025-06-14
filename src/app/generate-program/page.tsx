'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import { useState } from 'react';

const GenerateProgramPage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [callEnded, setCallEnded] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  // See messages and scroll them automatically
  const messageContainerRef = useRef<HTMLDivElement>(null);

  return <div>GenerateProgramPage</div>;
};

export default GenerateProgramPage;
