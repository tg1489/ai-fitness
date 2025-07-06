'use client';
import { useUser } from '@clerk/nextjs';
import React from 'react';

const ProfilePage = () => {
  const { user } = useUser();
  return <div>ProfilePage</div>;
};

export default ProfilePage;
