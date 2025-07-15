import Link from 'next/link';
import CornerElements from './CornerElements';
import { Button } from './ui/button';
import { ArrowRightIcon } from 'lucide-react';

const NoFitnessPlan = () => {
  return (
    <div className='relative backdrop-blur-sm border border-border rounded-lg p-10 text-center'>
      <CornerElements />
      <h2 className='text-2xl font-bold mb-4 font-mono'>
        <span className='text-primary'>No</span> fitness plans yet
      </h2>

      <p className='text-muted-foreground mb-6 max-w-md mx-auto'>
        
      </p>
      <Button>

      </Button>
    </div>
  );
};
