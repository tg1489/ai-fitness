'use client';
import { useUser } from '@clerk/nextjs';
import React from 'react';
import Link from 'next/link';
import { DumbbellIcon, HomeIcon, UserIcon, ZapIcon } from 'lucide-react';
import { Button } from './ui/button';



const Navbar = () => {
  const { isSignedIn } = useUser();
  return (
    <header
      className='fixed top-0 left-0 right-0 z-50 
    bg-background/60 backdrop-blur-md border-b border-border py-3'
    >
      <div className='container mx-auto flex items-center justify-between'>
        {/* LOGO */}
        <Link href='/' className='flex items-center gap-2'>
          <div className='p-1 bg-primary/10 rounded'>
            <ZapIcon className='w-4 h-4 text-primary' />
          </div>
          <span className='text-xl font-bold font-mono'>
            <span className='text-primary'>ai-</span>fitness
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className='flex items-center gap-5'>
            {isSignedIn ? (
                <>
                {/* HOME */}
                <Link href='/'
                className='flex items-center gap-1.5 text-sm hover:text-primary transition-colors'
                >
                    <HomeIcon size={16} />
                    <span>Home</span>
                </Link>

                {/* GENERATE */}
                <Link href='/generate-program'
                className='flex items-center gap-1.5 text-sm hover:text-primary transition-colors'
                >
                    <DumbbellIcon size={16} />
                    <span>Generate</span>
                </Link>

                {/* PROFILE */}
                <Link href='/profile'
                className='flex items-center gap-1.5 text-sm hover:text-primary transition-colors'
                >
                    <UserIcon size={16} />
                    <span>Profile</span>
                </Link>

                {/* BUTTON */}
                <Button 
                asChild
                variant='outline'
                className='ml-2 border-primary/50 text-primary hover:text-white hover:bg-primary/10'
                >
                    <Link href='/generate-program'>Get Started</Link>
                </Button>
                </>
            ) : ()}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
