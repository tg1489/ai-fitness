'use client';
import { act, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import React from 'react';
import { api } from '../../../convex/_generated/api';
import ProfileHeader from '@/components/ProfileHeader';
import { NoFitnessPlan } from '@/components/NoFitnessPlan';
import CornerElements from '@/components/CornerElements';

const ProfilePage = () => {
  const { user } = useUser();
  const userId = user?.id as string;
  const allPlans = useQuery(api.plans.getUserPlans, { userId });

  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);

  const activePlan = allPlans?.find((plan) => plan.isActive);
  const currentPlan = selectedPlanId
    ? allPlans?.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  return (
    <section className='relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4'>
      <ProfileHeader user={user} />

      {allPlans && allPlans?.length > 0 ? (
        <div className='space-y-8'>
          {/* Plan Selector */}
          <div className='relative backdrop-blur-sm border border-border p-6'>
            <CornerElements />
          </div>
        </div>
      ) : (
        <NoFitnessPlan />
      )}
    </section>
  );
};

export default ProfilePage;
