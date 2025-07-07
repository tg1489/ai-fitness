'use client';
import { act, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import React from 'react';
import { api } from '../../../convex/_generated/api';

const ProfilePage = () => {
  const { user } = useUser();
  const userId = user?.id as string;
  const allPlans = useQuery(api.plans.getUserPlans, { userId });

  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);

  const activePlan = allPlans?.find((plan) => plan.isActive);
  const currentPlan = selectedPlanId
    ? allPlans?.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  return <section></section>;
};

export default ProfilePage;
