import axios from "axios";

export const nodeAPI = axios.create({
  baseURL: "https://18976c3e5692.ngrok.io/api/v2",
});

export const faceAPI = axios.create({
  baseURL: "https://15d06a15fcca.ngrok.io",
});

export function auth() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}
