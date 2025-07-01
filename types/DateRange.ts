export interface DateRangeProps {
  startDate?: string;
  endDate?: string;
  onStart: (date: string) => void;
  onEnd: (date: string) => void;
  disablePast?: boolean;
}