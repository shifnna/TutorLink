import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000", 
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`, // or from store
  },
  withCredentials: true,
});

export default axiosClient;
