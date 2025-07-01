'use client';

import React, { useMemo } from 'react';
import {
  format,
  startOfMonth,
  getDaysInMonth,
  getDay,
  setDate,
  subMonths,
  addMonths,
} from 'date-fns';
import Days from './Days';
import PreviewMonth from './PreviewMonth';
import { DateRangeProps } from '@/types/DateRange';

// --- Type Definitions ---
interface CalendarProps extends DateRangeProps {
  date: Date;
  hoveredDate: Date | null;
  setHoveredDate: (date: Date | null) => void;
}

// --- Constants ---
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// --- Helper Functions for Calendar Grid Generation ---

/**
 * Generates the array of day elements for the visible portion of the previous month.
 */
const generatePrevMonthDays = (date: Date, firstDayOfWeek: number) => {
  const prevMonth = subMonths(date, 1);
  const daysInPrevMonth = getDaysInMonth(prevMonth);

  return Array.from({ length: firstDayOfWeek }, (_, i) => {
    const dayNumber = daysInPrevMonth - firstDayOfWeek + i + 1;
    const day = setDate(prevMonth, dayNumber);
    return <PreviewMonth key={`prev-${dayNumber}`} day={day} />;
  });
};

/**
 * Generates the array of selectable day elements for the current month.
 */
const generateCurrentMonthDays = (
  date: Date,
  props: Omit<CalendarProps, 'setHoveredDate'> & {
    setHoveredDate: (date: Date | null) => void;
  }
) => {
  const daysInCurrentMonth = getDaysInMonth(date);

  return Array.from({ length: daysInCurrentMonth }, (_, i) => {
    const day = setDate(date, i + 1);
    return (
      <Days
        key={`current-${i + 1}`}
        day={day}
        startDate={props.startDate}
        endDate={props.endDate}
        onStart={props.onStart}
        onEnd={props.onEnd}
        hoveredDate={props.hoveredDate}
        setHoveredDate={props.setHoveredDate}
        disablePast={props.disablePast}
      />
    );
  });
};

/**
 * Generates the array of day elements for the visible portion of the next month.
 */
const generateNextMonthDays = (date: Date, totalDays: number) => {
  const remainingSlots = (7 - (totalDays % 7)) % 7;
  if (remainingSlots === 0) return [];

  const nextMonth = addMonths(date, 1);

  return Array.from({ length: remainingSlots }, (_, i) => {
    const day = setDate(nextMonth, i + 1);
    return <PreviewMonth key={`next-${i + 1}`} day={day} />;
  });
};

// --- Main Calendar Component ---

const Calendar = React.memo<CalendarProps>(({ date, ...props }) => {
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = startOfMonth(date);
    const firstDayOfWeek = getDay(firstDayOfMonth); // 0 (Sun) - 6 (Sat)

    const prevMonthDays = generatePrevMonthDays(date, firstDayOfWeek);
    const currentMonthDays = generateCurrentMonthDays(date, { date, ...props });
    const nextMonthDays = generateNextMonthDays(
      date,
      prevMonthDays.length + currentMonthDays.length
    );

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, [date, props.startDate, props.endDate, props.hoveredDate, props]);

  return (
    <div className="flex flex-col">
      {/* Month/Year Header */}
      <h3 className="text-neutral-800 text-center font-semibold mb-4 text-lg">
        {format(date, 'MMMM yyyy')}
      </h3>

      {/* Week Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">{calendarDays}</div>
    </div>
  );
});

Calendar.displayName = 'Calendar';

export default Calendar;
