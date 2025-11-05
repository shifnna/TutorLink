export interface ISlot {
  duration?: number;
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  amount: number;
}

export interface ISlotRule{
  selectedDays?: string[];
  days: string[];
  startTime: string;
  endTime: string;
  duration: number;
  durationUnit: string;
  amount: number;
}