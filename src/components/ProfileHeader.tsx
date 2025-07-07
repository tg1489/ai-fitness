import React from 'react';
import { UserResource } from '@clerk/types';

const ProfileHeader = ({ user }: { user: UserResource }) => {
  return (
    <div className='mb-10 relative backdrop-blur-sm border border-border p-6'></div>
  );
};

export default ProfileHeader;
