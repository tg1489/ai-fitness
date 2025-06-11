const TerminalOverlay = () => {
  return (
    <div className='absolute bottom-0 left-0 right-0 p-4'>
      <div className='relative bg-cyber-terminal-bg backdrop-blur-sm border border-border rounded-lg p-3 overflow-hidden font-mono'>
        {/* Status Bar */}
        <div className='flex items-center justify-between mb-2 border-b border-border pb-1'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 rounded-full bg-primary animate-pulse'>
              <p className='text-xs text-primary'>SYSTEM ACTIVE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
