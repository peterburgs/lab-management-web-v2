import axios from "axios";

export const nodeAPI = axios.create({
  baseURL: "https://0a3f50c3d2c5.ngrok.io/api/v2",
});

export const faceAPI = axios.create({
  baseURL: "https://37be72c6318d.ngrok.io",
});

export function auth() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}
