import React from 'react';

const HomePage = () => {
  return (
    <div className='flex flex-col min-h-screen text-foreground overflow-hidden'>
      <section className='relative z-10 py-24 flex-grow'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative'>
            {/* Corner Decoration */}
            <div className='absolute -top10 left-0 w-40 h-40 border-l-2 border-t-2 border-border' />

            {/* Left Side Content */}
            <div className='lg:col-span-7 space-y-8 relative'>
              <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight'>
                <div>
                  <span className='text-foreground'>Transform</span>
                </div>
                <div>
                  <span className='text-primary'>Your Body</span>
                </div>
                <div className='pt-2'>
                  <span className='text-foreground'>With Advanced</span>
                </div>
                <div className='pt-2'>
                  <span className='text-foreground'>AI</span>
                  <span className='text-primary'>Technology</span>
                </div>
              </h1>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
