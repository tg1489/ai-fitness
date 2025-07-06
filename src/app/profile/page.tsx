'use client';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import React from 'react';
import { api } from '../../../convex/_generated/api';

const ProfilePage = () => {
  const { user } = useUser();
  const userId = user?.id as string;
  const allPlans = useQuery(api.plans.getUserPlans, { userId });
  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);

  return <div>ProfilePage</div>;
};

export default ProfilePage;
