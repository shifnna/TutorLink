import axiosClient from "../api/axiosClient";
import { handleApi, ICommonResponse } from "../utils/apiHelper";
import {Feedback} from "../types/ISession";


export const sentFeedback = async (data:Feedback)=>
    handleApi<ICommonResponse<null>>(axiosClient.post(`/api/session/client/sessions/feedback`,data));