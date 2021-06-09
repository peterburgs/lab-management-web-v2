import axios from "axios";

export const nodeAPI = axios.create({
  baseURL: "https://7bbb08cf64bb.ngrok.io/api/v2",
});

export const faceAPI = axios.create({
  baseURL: "https://f305aee7b82d.ngrok.io",
});

export function auth() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}
