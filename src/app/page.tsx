import { SignInButton, SignOutButton } from '@clerk/nextjs';
import React from 'react';

const HomePage = () => {
  return (
    <div>
      HomePage
      <SignOutButton />
    </div>
  );
};

export default HomePage;
