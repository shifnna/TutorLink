import { BookingDetails } from "./ISession";

export interface IRazorpayOrder {
  data:{
  id: string;
  amount: number;
  currency: string;
  }
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
}

export interface RazorpayInstance {
  open: () => void;
}

export interface IVerifyPayment {
  razorpay_order_id: string;

  razorpay_payment_id: string;

  razorpay_signature: string;

  bookingDetails: {
    tutorUserId: string;

    slotId: string;

    date: string;
    
    day: string;

    startTime: string;

    endTime: string;

    amount: number;
  };
}