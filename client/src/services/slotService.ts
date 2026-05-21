import axiosClient from "../api/axiosClient";
import { ISlotRule } from "../types/ISlotRules";
import { handleApi, ICommonResponse } from "../utils/apiHelper";

const BASE_URL = "/api/slots";

export const createSlotRule = async (data: ISlotRule) =>
  handleApi<ICommonResponse<null>>( axiosClient.post(`${BASE_URL}/tutor/create-slot-rule`,data));

export const getSlotRule = async () =>
  handleApi<ICommonResponse<ISlotRule>>( axiosClient.get(`${BASE_URL}/tutor/rule`));

export const getTutorRuleForClient = async (tutorId: string) =>
  handleApi<ICommonResponse<ISlotRule>>(axiosClient.get(`${BASE_URL}/client/rule/${tutorId}`));