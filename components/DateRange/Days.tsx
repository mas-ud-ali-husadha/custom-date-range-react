'use client';

import React, { useMemo, useCallback } from 'react';
import {
  format,
  isWithinInterval,
  isSameDay,
  startOfDay,
  isBefore,
  parseISO,
  isValid,
  isAfter,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRangeProps } from '@/types/DateRange';

// --- Type Definitions ---
interface DaysProps extends DateRangeProps {
  day: Date; // The specific day to render
  hoveredDate: Date | null;
  setHoveredDate: (date: Date | null) => void;
}

// --- Main Days Component ---
const Days = React.memo<DaysProps>(
  ({
    day,
    startDate: startStr,
    endDate: endStr,
    onStart,
    onEnd,
    hoveredDate,
    setHoveredDate,
    disablePast,
  }) => {
    // --- Memoized Date Logic ---
    const {
      startDate,
      endDate,
      disablePastDay,
      isStartDay,
      isEndDay,
      isInRange,
      isPreviewing,
    } = useMemo(() => {
      const today = startOfDay(new Date());
      const internaldisablePastDay = disablePast && isBefore(day, today);

      const start =
        startStr && isValid(parseISO(startStr)) ? parseISO(startStr) : null;
      const end = endStr && isValid(parseISO(endStr)) ? parseISO(endStr) : null;

      const internalIsStartDay = start && isSameDay(day, start);
      const internalIsEndDay = end && isSameDay(day, end);

      const internalIsInRange =
        start &&
        end &&
        isAfter(end, start) &&
        isWithinInterval(day, { start, end });

      // Is a date range being actively selected (i.e., start is set, but end is not)
      const internalIsPreviewing =
        start &&
        !end &&
        hoveredDate &&
        isAfter(hoveredDate, start) &&
        isWithinInterval(day, { start, end: hoveredDate });

      return {
        startDate: start,
        endDate: end,
        disablePastDay: internaldisablePastDay,
        isStartDay: internalIsStartDay,
        isEndDay: internalIsEndDay,
        isInRange: !!internalIsInRange,
        isPreviewing: !!internalIsPreviewing,
      };
    }, [startStr, endStr, day, hoveredDate, disablePast]);

    // --- Event Handlers ---
    const handleClick = useCallback(() => {
      if (disablePastDay) return;

      const formattedDay = format(day, 'yyyy-MM-dd');

      // If a start date exists, an end date doesn't, and the clicked day is after the start date
      if (startDate && !endDate && isAfter(day, startDate)) {
        onEnd(formattedDay);
      } else {
        // Otherwise, start a new selection.
        // This covers cases where:
        // 1. No dates are selected.
        // 2. Both dates are selected (resetting the range).
        // 3. The clicked date is before the current start date.
        onStart(formattedDay);
        onEnd(''); // Clear the end date
      }
    }, [disablePastDay, day, startDate, endDate, onStart, onEnd]);

    const handleMouseEnter = useCallback(() => {
      if (!disablePastDay && startDate && !endDate) {
        setHoveredDate(day);
      }
    }, [disablePastDay, startDate, endDate, day, setHoveredDate]);

    // --- Dynamic Class Names ---
    const dayClassName = cn(
      'relative z-0 flex w-full aspect-square items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out',
      {
        // Base states
        'cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-neutral-300':
          !disablePastDay,
        'text-gray-300 cursor-not-allowed': disablePastDay,

        // In-range and preview styling
        'bg-gray-100': (isInRange || isPreviewing) && !isStartDay && !isEndDay,
        'hover:bg-neutral-800 hover:text-white': isInRange || isPreviewing,

        // Start and End day styling (highest priority)
        'bg-neutral-800 text-white hover:bg-neutral-700':
          isStartDay || isEndDay,
      }
    );

    return (
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHoveredDate(null)} // Simplified mouse leave
        className={dayClassName}
        disabled={disablePastDay}
        tabIndex={disablePastDay ? -1 : 0}
      >
        {format(day, 'd')}
      </button>
    );
  }
);

Days.displayName = 'Days';

export default Days;