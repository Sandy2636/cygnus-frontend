import axios from "axios";

const instance = axios.create({
  baseURL: "https://cygnus-backend.vercel.app",
});

export default instance;
