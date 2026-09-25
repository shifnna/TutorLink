export interface IDurationOption {
  minutes: number;
  amount: number;
}

export interface ISlotRule {
  _id: string;
  ruleCode: string;
  tutorId: string;
  weekdays: string[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  durations: IDurationOption[];
}

export interface ICreateSlotRulePayload {
  weekdays: string[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  durations: IDurationOption[];
}


export interface IAvailableSlot {
  ruleId: string;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  durations: IDurationOption[];
}

export interface IBookSlotPayload {
  ruleId: string;
  date: string;
  minutes: number;
}

export interface IBookedSlotResponse {
  sessionId: string;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  duration: number;
  amount: number;
}