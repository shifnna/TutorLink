import axiosClient from "../api/axiosClient";
import { handleApi, ICommonResponse } from "../utils/apiHelper";
import {Feedback} from "../types/ISession";
import { IUser } from "../types/IUser";


export const sentFeedback = async (data:Feedback)=>
    handleApi<ICommonResponse<null>>(axiosClient.post(`/api/session/client/sessions/feedback`,data));

export const editProfileImage = async (data:string|null)=>
    handleApi<ICommonResponse<null>>(axiosClient.post(`/api/client/editProfileImage`,data));

export const editProfileData = async (data:IUser|null)=>
    handleApi<ICommonResponse<null>>(axiosClient.post(`/api/client/setProfileImage`,data));

export const getSubjects = async ()=>
    handleApi<string[]>(axiosClient.get(`/api/client/getSubjects`));
