import axios from "axios";

export const nodeAPI = axios.create({
  baseURL: "https://756cbcebb37d.ngrok.io/api/v2",
});

export const faceAPI = axios.create({
  baseURL: "https://0c16afa540c0.ngrok.io",
});

export function auth() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}
