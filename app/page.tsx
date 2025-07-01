'use client';
import DateRange from '@/components/DateRange';
import { useState } from 'react';

export default function Home() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [disablePast, setDisablePast] = useState<boolean>(true);

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">Date Range Picker</h1>

      <div className="mb-8">
        <DateRange
          startDate={startDate}
          endDate={endDate}
          onStart={setStartDate}
          onEnd={setEndDate}
          disablePast={disablePast}
        />
      </div>

      {/* Control to toggle past dates */}
      <div className="flex items-center justify-center mb-8">
        <input
          type="checkbox"
          id="disable-past"
          checked={disablePast}
          onChange={(e) => setDisablePast(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-neutral-600 focus:ring-neutral-500"
        />
        <label
          htmlFor="disable-past"
          className="ml-2 block text-sm text-gray-900"
        >
          Disable Past Dates
        </label>
      </div>

      {/* Selected Range Display */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold">Selected Range</h2>
          {(startDate || endDate) && (
            <button
              onClick={handleReset}
              className="text-sm text-neutral-600 hover:text-neutral-800 underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Start:</span>{' '}
            <span className="text-neutral-700">
              {startDate || 'Not selected'}
            </span>
          </div>
          <div>
            <span className="font-medium">End:</span>{' '}
            <span className="text-neutral-700">
              {endDate || 'Not selected'}
            </span>
          </div>
          {startDate && endDate && (
            <div className="pt-2 border-t border-gray-200">
              <span className="font-medium">Duration:</span>{' '}
              <span className="text-neutral-700">
                {Math.ceil(
                  (new Date(endDate).getTime() -
                    new Date(startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                ) + 1}{' '}
                days
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
