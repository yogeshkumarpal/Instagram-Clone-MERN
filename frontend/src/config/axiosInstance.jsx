import axios from "axios";

export const axiosIntance = axios.create({
  baseURL: "https://instagram-clone-owi9.onrender.com/api",
  withCredentials: true,
});


