import axios from "axios";

const api = axios.create({
  //baseURL: "http://192.168.29.93:8080/api",
  baseURL: "https://lifebytesapi-production.up.railway.app/api",
  timeout: 10000,
});
export default api;
