import axiosClient from "../api/axiosClient";
import { ISlot, ISlotRule } from "../types/ISlotRules";
import { handleApi, ICommonResponse } from "../utils/apiHelper";

export const createSlotRule = async (data:ISlotRule) => 
  handleApi<ICommonResponse<null>>(axiosClient.post("/api/slots/tutor/create-slot-rule", data));

export const getSlotRule = async () =>
  handleApi<ICommonResponse<any>>(axiosClient.get("/api/slots/tutor/rule"));

export const getSlots = async () => 
  handleApi<ICommonResponse<ISlot[]>>(axiosClient.get("/api/slots/tutor"));

export const deleteSlot = async (slotId: string) => 
  handleApi<ICommonResponse<null>>(axiosClient.delete(`/api/slots/tutor/${slotId}`));
