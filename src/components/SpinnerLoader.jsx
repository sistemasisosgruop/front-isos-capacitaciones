import React from 'react';

const SpinnerLoader = ({ isLoading = false }) => {
  if (!isLoading) {
    return null; // Don't render if not loading
  }

  return (
    <div className="flex items-center justify-center h-full" style={{height:'60vh'}}>
      <span className="loader"></span>
    </div>
  );
};

export default SpinnerLoader;