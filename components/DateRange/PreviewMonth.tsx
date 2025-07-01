import React from 'react';
import { format } from 'date-fns';

const PreviewMonth = ({ day }: { day: Date }) => {
  return (
    <button
      type="button"
      className="text-gray-300 relative z-0 flex w-full aspect-square transition duration-200 ease-in-out items-center justify-center text-sm font-medium rounded-lg"
      disabled
    >
      {format(day, 'd')}
    </button>
  );
};

export default PreviewMonth;