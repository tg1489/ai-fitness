'use client';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { SignOutButton } from '@clerk/nextjs';

import React from 'react';

const HomePage = () => {
  return (
    <div>
      HomePage
      <SignedOut>
        <SignInButton /> {/* Only display Sign In Btn if user is Signed Out */}
      </SignedOut>
      <SignedIn>
        <SignOutButton /> {/* Only display Sign Out Btn if user is Signed In */}
      </SignedIn>
    </div>
  );
};

export default HomePage;
