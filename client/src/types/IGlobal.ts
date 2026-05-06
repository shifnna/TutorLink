import { RazorpayInstance, RazorpayOptions } from "./IPayment";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export {};
