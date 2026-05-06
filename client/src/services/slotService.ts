import axiosClient from "../api/axiosClient";
import { ISlotRule } from "../types/ISlotRules";
import { handleApi, ICommonResponse } from "../utils/apiHelper";

export const createSlotRule = async (data:ISlotRule) => 
  handleApi<ICommonResponse<null>>(axiosClient.post("/api/slots/tutor/create-slot-rule", data));

export const getSlotRule = async () =>
  handleApi<ICommonResponse<ISlotRule>>(axiosClient.get("/api/slots/tutor/rule"));

export const getTutorRuleForClient = async (tutorId: string) =>
  handleApi<ICommonResponse<ISlotRule>>(axiosClient.get(`/api/slots/client/rule/${tutorId}`));
