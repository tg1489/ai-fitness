'use client';

import { Card } from '@/components/ui/card';
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

  const toggleCall = async () => {
    if (callActive) vapi.stop();
    else {
      try {
        setConnecting(true);
        await vapi.start();
        setMessages([]);
        setCallEnded(false);

        const fullName = user?.firstName
          ? `${user.firstName} ${user.lastName} || ''`.trim()
          : 'There';
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            full_name: fullName,
          },
        });
      } catch (error) {
        console.log('Failed to start call', error);
        setConnecting(false);
      }
    }
  };

  return (
    <div className='flex flex-col min-h-screen text-foreground overflow-hidden pb-6 pt-24'>
      <div className='container mx-auto px-4 h-full max-w-5xl'>
        {/* Title */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold font-mono'>
            <span>Generate Your </span>
            <span className='text-primary uppercase'>Fitness Program</span>
          </h1>
          <p className='text-muted-foreground mt-2'>
            Have a voice conversation with your AI assistant to create your
            personal plan
          </p>
        </div>

        {/* VIDEO CALL AREA */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          <Card className='bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative'>
            
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GenerateProgramPage;
