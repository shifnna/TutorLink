import axiosClient from "../api/axiosClient";
import { ISession } from "../components/userCommon/sessionTable";
import { ISlot } from "../types/ISlotRules";
import { handleApi, ICommonResponse } from "../utils/apiHelper";

export const cancelSession = async (id:string)=>
    handleApi<ICommonResponse<null>>(axiosClient.patch(`/api/slots/client/sessions/cancel/${id}`));

export const getAllSessions = async (id:string)=>
    handleApi<ICommonResponse<ISession[]>>(axiosClient.get(`/api/slots/client/sessions/${id}`));

export const bookSlot = async (slotId:string,userId:string)=>
    handleApi<ICommonResponse<ISession>>(axiosClient.post(`/api/slots/client/book/${slotId}/${userId}`));

export const showSlots = async (tutorId:string)=>
    handleApi<ICommonResponse<ISlot[]>>(axiosClient.get(`/api/slots/client/${tutorId}`));