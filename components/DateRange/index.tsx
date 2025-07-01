'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Calendar from './Calendar';
import { DateRangeProps } from '@/types/DateRange';

const DateRange = ({
  startDate,
  endDate,
  onStart,
  onEnd,
  disablePast,
}: DateRangeProps) => {
  const [monthOffset, setMonthOffset] = useState(0);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const currentDate = useMemo(
    () => addMonths(new Date(), monthOffset),
    [monthOffset]
  );

  const handlePrevMonth = useCallback(() => {
    setMonthOffset((prev) => prev - 1);
  }, []);

  const handleNextMonth = useCallback(() => {
    setMonthOffset((prev) => prev + 1);
  }, []);

  const handleHoveredDateChange = useCallback((date: Date | null) => {
    setHoveredDate(date);
  }, []);

  return (
    <div className="relative rounded-lg shadow-lg border p-6 bg-white max-w-md mx-auto">
      {/* Navigation Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 absolute cursor-pointer left-7 top-8 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-200"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 absolute cursor-pointer right-7 top-8 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-200"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <Calendar
        date={currentDate}
        startDate={startDate}
        endDate={endDate}
        onStart={onStart}
        onEnd={onEnd}
        hoveredDate={hoveredDate}
        setHoveredDate={handleHoveredDateChange}
        disablePast={disablePast}
      />
    </div>
  );
};

export default DateRange;
