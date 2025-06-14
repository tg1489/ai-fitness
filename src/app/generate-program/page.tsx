'use client';

import { vapi } from '@/lib/vapi';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
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

  // Auto-scroll messages
  useEffect(() => {
    if (messageContainerRef.current) {
      // Trick to auto-scroll in a div
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Navigate user to profile page after call ends
  useEffect(() => {
    if (callEnded) {
      const redirectTimer = setTimeout(() => {
        router.push('/profile');
      }, 1500);
      // Get rid of timeout when unmounting
      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router]);

  // Setup event listeners for vapi
  useEffect(() => {
    const handleCallStart = () => {
      console.log('Call started');
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };
    const handleCallEnd = () => {
      console.log('Call ended');
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    };
    const handleSpeechStart = () => {
      console.log('AI started speaking');
      setIsSpeaking(true);
    };
    const handleSpeechEnd = () => {
      console.log('AI stopped speaking');
      setIsSpeaking(false);
    };
    const handleMessage = (message: any) => {};
    const handleError = (error: any) => {
      console.log('Vapi Error', error);
      setConnecting(false);
      setCallActive(false);
    };

    vapi
      .on('call-start', handleCallStart)
      .on('call-end', handleCallEnd)
      .on('speech-start', handleSpeechStart)
      .on('speech-end', handleSpeechEnd)
      .on('message', handleMessage)
      .on('error', handleError);

    // Cleanut Event Listeners on Unmount
    return () => {
      vapi
        .off('call-start', handleCallStart)
        .off('call-end', handleCallEnd)
        .off('speech-start', handleSpeechStart)
        .off('speech-end', handleSpeechEnd)
        .off('message', handleMessage)
        .off('error', handleError);
    };
  }, []);

  return <div>GenerateProgramPage</div>;
};

export default GenerateProgramPage;
