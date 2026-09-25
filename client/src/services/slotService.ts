import axiosClient from "../api/axiosClient";
import { IAvailableSlot, IBookedSlotResponse, IBookSlotPayload, ICreateSlotRulePayload, ISlotRule } from "../types/ISlotRules";
import { handleApi, ICommonResponse } from "../utils/apiHelper";

const BASE_URL = "/api/slots";

export const createSlotRule = async (data: ICreateSlotRulePayload) =>
  handleApi<ICommonResponse<ISlotRule>>(axiosClient.post(`${BASE_URL}/tutor/create-slot-rule`, data));

export const getSlotRules = async () =>
  handleApi<ICommonResponse<ISlotRule[]>>(axiosClient.get(`${BASE_URL}/tutor/rules`));

export const getAvailableSlots = async (tutorId: string, from = "", to = "") =>
  handleApi<ICommonResponse<IAvailableSlot[]>>(
    axiosClient.get(`${BASE_URL}/client/available-slots/${tutorId}`, { params: { from, to } })
  );

export const bookSlot = async (data: IBookSlotPayload) =>
  handleApi<ICommonResponse<IBookedSlotResponse>>(axiosClient.post(`${BASE_URL}/client/book-slot`, data));