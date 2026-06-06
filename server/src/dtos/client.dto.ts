export interface BookingDetailsDTO {
  tutorUserId: string;
  slotId: string;
  day: string;
  date: string;
  startTime: string;
  endTime: string;
  amount: number;
}

export interface verifyPaymentDTO{
    razorpay_order_id : string , 
    razorpay_payment_id : string, 
    razorpay_signature : string, 
    bookingDetails: BookingDetailsDTO,
}

export interface FeedbackDTO {
  sessionId:string,
  rating:number,
  message:string,
  unsatisfied:boolean,
}