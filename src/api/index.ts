import axios from "axios";

export const api = axios.create({
  baseURL: "https://b17ce19dfbec.ngrok.io/api/v2",
});

export function auth() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}
