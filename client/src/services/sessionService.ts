import axiosClient from "../api/axiosClient";
import { ISession } from "../components/userCommon/sessionTable";
import { IRazorpayOrder, IVerifyPayment } from "../types/IPayment";
import { handleApi, ICommonResponse } from "../utils/apiHelper";

export const cancelSession = async (id:string)=>
    handleApi<ICommonResponse<null>>(axiosClient.patch(`/api/session/client/sessions/cancel/${id}`));

export const getAllSessions = async ()=>
    handleApi<ICommonResponse<ISession[]>>(axiosClient.get(`/api/session/client/sessions`));

export const bookSlot = async (slotId:string,userId:string)=>
    handleApi<ICommonResponse<ISession>>(axiosClient.post(`/api/slots/client/book/${slotId}/${userId}`));

export const createOrder = async (amount: number) =>
  handleApi<IRazorpayOrder>(axiosClient.post("/api/session/client/book-session", {amount}));

export const verifyPayment = async (payload: IVerifyPayment) => 
  handleApi(axiosClient.post("/api/session/client/verify-payment", payload));
