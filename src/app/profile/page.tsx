'use client';
import { useUser } from '@clerk/nextjs';
import React from 'react';

const ProfilePage = () => {
  const { user } = useUser();
  const userId = user?.id;

  return <div>ProfilePage</div>;
};

export default ProfilePage;
