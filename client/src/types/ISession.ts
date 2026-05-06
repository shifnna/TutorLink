export interface ISession {
  _id: string;
  tutorId: { _id: string; name: string; email: string };
  userId: { _id: string; name: string; email: string };
  date: string;
  startTime: string;
  endTime: string;
  amount: number;
  status: string;
  videoRoomUrl?: string;
  createdAt: string;

  payment?: {
    provider: string;
    orderId: string;
    paymentId: string;
    status: string;
  };
}

export interface BookingDetails {
  tutorId: string;
  selectedDate: string;
  startTime: string;
  endTime: string;
  amount: number;
}

export interface Feedback {
  sessionId:string,
  rating:number,
  message:string,
  unsatisfied:boolean,
}
