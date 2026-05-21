export interface ISchedule {
  id?: string;
  day: string;
  startTime: string;
  endTime: string;
  duration: number;
  durationUnit: string;
  amount: number;
  isBooked?: boolean;
}

export interface ISlotRule {
  schedules: ISchedule[];
}