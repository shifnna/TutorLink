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
  days: string[];
  startTime: string;
  endTime: string;
  duration: number;
  durationUnit: string;
  amount: number;
}