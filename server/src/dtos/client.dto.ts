export interface verifyPaymentDTO{
    razorpay_order_id : string , 
    razorpay_payment_id : string, 
    razorpay_signature : string, 
    bookingDetails: any,
}

export interface FeedbackDTO {
  sessionId:string,
  rating:number,
  message:string,
  unsatisfied:boolean,
}