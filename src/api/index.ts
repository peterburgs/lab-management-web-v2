import axios from "axios";

export const api = axios.create({
  baseURL: "https://300985f3d6cd.ngrok.io/api/v2",
});

export function auth() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}
