import React from 'react';
import { UserResource } from '@clerk/types';
import CornerElements from './CornerElements';

const ProfileHeader = ({ user }: { user: UserResource }) => {
  return (
    <div className='mb-10 relative backdrop-blur-sm border border-border p-6'>
      <CornerElements />

      <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
        <div>
          {user.imageUrl ? (
            <div className='relative w-24 h-24 overflow-hidden rounded-lg'>
              <img
                src={user.imageUrl}
                alt={user.fullName || 'Profile'}
                className='w-full h-full object-cover'
              />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
